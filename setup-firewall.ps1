# 以管理员身份运行此脚本
# 右键点击 -> 使用 PowerShell 运行

Write-Host "正在配置 Windows 防火墙..." -ForegroundColor Green

# 添加入站规则 - 后端 API (端口 3001)
netsh advfirewall firewall add rule name="English Dictation - Backend" dir=in action=allow protocol=tcp localport=3001

# 添加入站规则 - 前端开发服务器 (端口 5173)
netsh advfirewall firewall add rule name="English Dictation - Frontend" dir=in action=allow protocol=tcp localport=5173

Write-Host ""
Write-Host "防火墙规则已添加！" -ForegroundColor Green
Write-Host ""
Write-Host "局域网用户现在可以通过以下地址访问：" -ForegroundColor Yellow
Write-Host ""

# 获取本机 IP 地址
$ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -ExpandProperty IPAddress

foreach ($ip in $ipAddresses) {
    Write-Host "  前端: http://${ip}:5173" -ForegroundColor Cyan
    Write-Host "  后端: http://${ip}:3001" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
