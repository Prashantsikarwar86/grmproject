<#
init-repo.ps1
Helper script to initialize a git repo, make an initial commit, add remote and push.
Usage: run in the repository root (or just double-click in Explorer):
  .\init-repo.ps1 -RemoteUrl "https://github.com/Prashantsikarwar86/grmproject.git"
If Git is missing, the script exits with a helpful message.
#>
param(
    [string]$RemoteUrl = "https://github.com/Prashantsikarwar86/grmproject.git"
)

function Abort([string]$msg){
    Write-Host "ERROR: $msg" -ForegroundColor Red
    exit 1
}

# Ensure running in script directory
$repoDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $repoDir

# Check for git
try{
    git --version > $null 2>&1
} catch {
    Abort "git not found. Install Git for Windows and ensure 'git' is on PATH. See https://git-scm.com/download/win"
}

# Initialize if needed
if(-not (Test-Path "$repoDir\.git")){
    Write-Host "Initializing git repository..."
    git init || Abort "git init failed"
} else {
    Write-Host ".git already exists — skipping git init"
}

# Ensure user.name and user.email are set locally for this repo (fall back to global if present)
$uname = git config user.name
$uemail = git config user.email
if(-not $uname){
    $gname = git config --global user.name
    if($gname){
        git config user.name "$gname"
    } else {
        $inputName = Read-Host "Enter user.name for commits (e.g. Your Name)"
        if(-not $inputName){ Abort "user.name is required to make commits." }
        git config user.name "$inputName"
    }
}
if(-not $uemail){
    $gemail = git config --global user.email
    if($gemail){
        git config user.email "$gemail"
    } else {
        $inputEmail = Read-Host "Enter user.email for commits (e.g. you@example.com)"
        if(-not $inputEmail){ Abort "user.email is required to make commits." }
        git config user.email "$inputEmail"
    }
}

# Stage changes
Write-Host "Staging files..."
git add . || Abort "git add failed"

# Commit if there are staged changes
$changes = git status --porcelain
if(-not [string]::IsNullOrWhiteSpace($changes)){
    Write-Host "Committing: first commit"
    git commit -m "first commit" || Abort "git commit failed"
} else {
    Write-Host "No changes to commit (working tree clean)"
}

# Rename branch to main
Write-Host "Setting branch to 'main'"
git branch -M main || Abort "git branch -M main failed"

# Add remote
if($RemoteUrl){
    $existing = git remote get-url origin 2>$null
    if($existing){
        Write-Host "Remote 'origin' already exists — setting URL to $RemoteUrl"
        git remote set-url origin $RemoteUrl || Abort "git remote set-url failed"
    } else {
        Write-Host "Adding remote origin $RemoteUrl"
        git remote add origin $RemoteUrl || Abort "git remote add failed"
    }
}

# Push
Write-Host "Pushing to origin main (this may prompt for credentials)..."
try{
    git push -u origin main
} catch {
    Write-Host "Push failed. If this is your first time pushing, authenticate with GitHub (PAT or credential manager) or configure SSH keys." -ForegroundColor Yellow
    exit 0
}

Write-Host "Done." -ForegroundColor Green
