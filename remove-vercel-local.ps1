# remove-vercel-local.ps1
# Roda localmente no diretório do repositório e aplica mudanças diretamente (sem criar branch).
# Use com cuidado. Requisitos: git e GitHub CLI (gh) instalados e autenticados.

function Write-Err($msg){ Write-Host $msg -ForegroundColor Red }
function Write-Warn($msg){ Write-Host $msg -ForegroundColor Yellow }
function Write-Ok($msg){ Write-Host $msg -ForegroundColor Green }

# Pré-checagens
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Err "git não encontrado. Instale git e tente novamente."
  exit 1
}
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Warn "gh (GitHub CLI) não encontrado. O script continuará, mas não poderá remover secrets/webhooks via API."
}

# Verifica se estamos dentro de um repo git
try {
  $inside = git rev-parse --is-inside-work-tree 2>$null
} catch { $inside = $null }
if (-not $inside) {
  Write-Err "Este diretório não parece ser um repositório git. Abra o PowerShell na pasta do repo e rode o script novamente."
  exit 1
}

# Obtém branch atual
$branch = (git rev-parse --abbrev-ref HEAD) -replace '\r|\n',''
Write-Host "Branch atual: $branch"

# Tenta obter owner/repo do remote origin
$remoteUrl = git config --get remote.origin.url 2>$null
$repoFull = $null
if ($remoteUrl) {
  if ($remoteUrl -match 'github.com[:\/](.+?)(?:\.git)?$') {
    $repoFull = $matches[1]
  }
}
if (-not $repoFull) {
  Write-Warn "Não foi possível extrair owner/repo do remote 'origin'. Algumas ações via gh podem precisar que você informe manualmente."
} else {
  Write-Host "Repository detected: $repoFull"
}

# Mostrar aviso final antes de aplicar
Write-Warn "AVISO: o script vai commitar e dar push no branch atual ($branch). Sem backups nem branches adicionais."
Write-Host "Se quiser cancelar, pressione Ctrl+C agora." 
Start-Sleep -Seconds 5

# 1) Procurar ocorrências de "vercel"
Write-Host "`nProcurando ocorrências de 'vercel' (git grep)..."
try {
  $grep = git grep -n "vercel" 2>$null
} catch { $grep = $null }
if ($grep) { $grep | ForEach-Object { Write-Host $_ } } else { Write-Host "Nenhuma ocorrência textual encontrada (git grep)." }

# 2) Remover .vercel e vercel.json
if (Test-Path ".vercel") {
  Write-Host "`nRemovendo pasta .vercel..."
  try {
    git rm -r --cached .vercel -f 2>$null
  } catch {}
  try { Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue } catch {}
  Write-Ok ".vercel removida (se existia)."
} else { Write-Host ".vercel não encontrado." }

if (Test-Path "vercel.json") {
  Write-Host "Removendo vercel.json..."
  try { git rm -f vercel.json 2>$null } catch {}
  try { Remove-Item -Force vercel.json -ErrorAction SilentlyContinue } catch {}
  Write-Ok "vercel.json removido (se existia)."
} else { Write-Host "vercel.json não encontrado." }

# 3) Remover workflows que mencionem vercel
$workflowsRemoved = @()
if (Test-Path ".github\workflows") {
  Write-Host "`nProcurando workflows com 'vercel' ou 'VERCEL_TOKEN'..."
  $matches = Select-String -Path .github\workflows\*.yml -Pattern "vercel|VERCEL_TOKEN" -SimpleMatch -CaseSensitive:$false -ErrorAction SilentlyContinue
  if ($matches) {
    $files = $matches | ForEach-Object { Split-Path $_.Path -Leaf } | Sort-Object -Unique
    foreach ($f in $files) {
      $wfPath = Join-Path ".github\workflows" $f
      if (Test-Path $wfPath) {
        Write-Host "Removendo workflow: $f"
        try { git rm -f $wfPath 2>$null } catch { Write-Warn "Falha ao remover $f via git." }
        $workflowsRemoved += $f
      }
    }
  } else {
    Write-Host "Nenhum workflow contendo 'vercel' encontrado."
  }
} else {
  Write-Host "Pasta .github/workflows não existe."
}

# 4) Remover scripts em package.json que chamem vercel
$scriptsRemoved = @()
if (Test-Path "package.json") {
  Write-Host "`nVerificando package.json para scripts que usem 'vercel'..."
  try {
    $pkg = Get-Content package.json -Raw | ConvertFrom-Json
    if ($pkg.scripts) {
      foreach ($name in $pkg.scripts.PSObject.Properties.Name) {
        if ($pkg.scripts.$name -match "vercel") {
          $scriptsRemoved += $name
          $pkg.scripts.PSObject.Properties.Remove($name)
        }
      }
      if ($scriptsRemoved.Count -gt 0) {
        $pkg | ConvertTo-Json -Depth 10 | Set-Content package.json
        git add package.json
        Write-Ok "Removidos scripts: $($scriptsRemoved -join ', ')"
      } else {
        Write-Host "Nenhum script chamando 'vercel' encontrado em package.json."
      }
    } else {
      Write-Host "package.json não tem seção scripts."
    }
  } catch {
    Write-Warn "Erro ao ler/editar package.json (format inválido?)."
  }
} else {
  Write-Host "package.json não encontrado."
}

# 5) Tentar remover badges do README.md (simples)
if (Test-Path "README.md") {
  Write-Host "`nTentando remover badges com 'vercel' no README.md..."
  try {
    $old = Get-Content README.md -Raw
    $new = $old -replace '\!\[.*vercel.*\]\([^\)]*\)',''
    if ($new -ne $old) {
      $new | Set-Content README.md
      git add README.md
      Write-Ok "Badge(s) possivelmente removido(s) do README.md (revise manualmente)."
    } else {
      Write-Host "Nenhum badge 'vercel' detectado no README.md."
    }
  } catch {
    Write-Warn "Erro ao editar README.md."
  }
}

# 6) Preparar commit/push
Write-Host "`nVerificando mudanças para commitar..."
$status = git status --porcelain
if ($status) {
  Write-Host "Mudanças detectadas, fazendo commit..."
  try {
    git add -A
    git commit -m "Remove Vercel config, workflows and scripts" 2>$null
    Write-Ok "Commit criado."
    try {
      git push origin $branch 2>$null
      Write-Ok "Push realizado para origin/$branch."
    } catch {
      Write-Warn "Falha ao dar push (verifique permissões/remote)."
    }
  } catch {
    Write-Warn "Falha ao commitar alterações: $_"
  }
} else {
  Write-Host "Nenhuma alteração para commitar."
}

# 7) Remover secrets via gh (se possível)
if ((Get-Command gh -ErrorAction SilentlyContinue) -and $repoFull) {
  Write-Host "`nTentando listar secrets via gh..."
  try {
    $secretsOut = gh secret list --repo $repoFull 2>$null | Out-String
    $candidates = @("VERCEL_TOKEN","VERCEL_PROJECT_ID","VERCEL_ORG_ID")
    foreach ($s in $candidates) {
      if ($secretsOut -match $s) {
        Write-Host "Removendo secret $s ..."
        try { gh secret remove $s --repo $repoFull 2>$null; Write-Ok "Secret $s removido." } catch { Write-Warn "Falha ao remover secret $s." }
      }
    }
  } catch {
    Write-Warn "Não foi possível listar/remover secrets via gh (permissões/API)."
  }
} elseif (-not $repoFull) {
  Write-Warn "Owner/repo não detectado; não tentei remover secrets via gh."
} else {
  Write-Warn "gh não disponível; não tentei remover secrets via API."
}

# 8) Remover webhooks via gh (se possível)
if ((Get-Command gh -ErrorAction SilentlyContinue) -and $repoFull) {
  Write-Host "`nTentando listar webhooks via gh..."
  try {
    $hooksJson = gh api repos/$repoFull/hooks 2>$null
    if ($hooksJson) {
      $hooks = $hooksJson | ConvertFrom-Json
      foreach ($h in $hooks) {
        $url = $h.config.url -as [string]
        if ($url -and $url -match "vercel") {
          Write-Host "Removendo webhook id $($h.id) -> $url"
          try { gh api -X DELETE repos/$repoFull/hooks/$($h.id) 2>$null; Write-Ok "Webhook $($h.id) removido." } catch { Write-Warn "Falha ao remover webhook $($h.id)." }
        }
      }
    }
  } catch {
    Write-Warn "Não foi possível listar/remover webhooks via gh (permissões/API)."
  }
}

Write-Ok "`nProcesso concluído. Revise os arquivos modificados e o histórico do git."
Write-Host "Dicas de verificação:"
Write-Host " - git status"
Write-Host " - git log -n 5"
if ($repoFull) { Write-Host " - gh secret list --repo $repoFull" ; Write-Host " - gh api repos/$repoFull/hooks --jq '.[] | {id: .id, url: .config.url}'" }