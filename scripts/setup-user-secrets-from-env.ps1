param(
    [string]$Project = "backend/src/NotesApp.API/NotesApp.API.csproj",
    [string]$EnvFile = ".env"
)

if (-not (Test-Path $EnvFile)) {
    throw "Missing $EnvFile. Create it from .env.example first."
}

if (-not (Test-Path $Project)) {
    throw "Project file not found: $Project"
}

$values = @{}
Get-Content $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith("#")) {
        return
    }

    $parts = $line -split "=", 2
    if ($parts.Count -ne 2) {
        return
    }

    $key = $parts[0].Trim()
    $value = $parts[1].Trim()
    if (-not [string]::IsNullOrWhiteSpace($key)) {
        $values[$key] = $value
    }
}

$connectionStringKey = "ConnectionStrings__DefaultConnection"
if (-not $values.ContainsKey($connectionStringKey)) {
    $required = @("POSTGRES_DB", "POSTGRES_USER", "POSTGRES_PASSWORD")
    foreach ($key in $required) {
        if (-not $values.ContainsKey($key) -or [string]::IsNullOrWhiteSpace($values[$key])) {
            throw "$connectionStringKey missing and required $key is not set in $EnvFile"
        }
    }

    $host = "localhost"
    if ($values.ContainsKey("POSTGRES_HOST") -and -not [string]::IsNullOrWhiteSpace($values["POSTGRES_HOST"])) {
        $host = $values["POSTGRES_HOST"]
    }

    $port = "5432"
    if ($values.ContainsKey("POSTGRES_PORT") -and -not [string]::IsNullOrWhiteSpace($values["POSTGRES_PORT"])) {
        $port = $values["POSTGRES_PORT"]
    }

    $values[$connectionStringKey] = "Host=$host;Port=$port;Database=$($values['POSTGRES_DB']);Username=$($values['POSTGRES_USER']);Password=$($values['POSTGRES_PASSWORD'])"
}

dotnet user-secrets set --project $Project "ConnectionStrings:DefaultConnection" "$($values[$connectionStringKey])" | Out-Null

Write-Host "User Secrets updated: ConnectionStrings:DefaultConnection"
Write-Host "Project: $Project"
