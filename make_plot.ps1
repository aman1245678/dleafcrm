Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap(1000, 700)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::White)

# Grid
$penGrid = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(230, 230, 230), 1)
for($x=100; $x -le 900; $x+=50){ $g.DrawLine($penGrid, $x, 100, $x, 600) }
for($y=100; $y -le 600; $y+=50){ $g.DrawLine($penGrid, 100, $y, 900, $y) }

# Axes
$penAxis = New-Object System.Drawing.Pen([System.Drawing.Color]::Black, 2)
$g.DrawLine($penAxis, 100, 600, 930, 600)
$g.DrawLine($penAxis, 100, 600, 100, 70)

$font = New-Object System.Drawing.Font('Arial', 12)
$brush = [System.Drawing.Brushes]::Black

$g.DrawString('t (s)', $font, $brush, 935, 590)
$g.DrawString('V (V)', $font, $brush, 50, 50)

for($i=0; $i -le 16; $i+=2){ 
    $g.DrawString($i.ToString(), $font, $brush, (100 + $i*50 - 8), 610) 
    $g.DrawLine($penAxis, (100 + $i*50), 600, (100 + $i*50), 606)
}

for($j=2; $j -le 10; $j+=2){ 
    $g.DrawString($j.ToString(), $font, $brush, 65, (600 - $j*50 - 8)) 
    $g.DrawLine($penAxis, 94, (600 - $j*50), 100, (600 - $j*50))
}

# Blue waveform
# V(t): 0->2s rises to 8V; 2->6s flat at 8V; 6->8s drops to 3V; 8->12s flat at 3V; 12->16s drops to 0V
$penWave = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(0, 100, 220), 4)
$p1 = [System.Drawing.PointF]::new(100, 600)
$p2 = [System.Drawing.PointF]::new(200, 200)
$p3 = [System.Drawing.PointF]::new(400, 200)
$p4 = [System.Drawing.PointF]::new(500, 450)
$p5 = [System.Drawing.PointF]::new(700, 450)
$p6 = [System.Drawing.PointF]::new(900, 600)

$g.DrawLine($penWave, $p1, $p2)
$g.DrawLine($penWave, $p2, $p3)
$g.DrawLine($penWave, $p3, $p4)
$g.DrawLine($penWave, $p4, $p5)
$g.DrawLine($penWave, $p5, $p6)

$bmp.Save('C:\Users\Aman\Desktop\piecewise_voltage.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save('C:\Users\Aman\.gemini\antigravity-ide\brain\d9090bea-82fa-4f91-a43c-57e8a90fc14f\piecewise_voltage.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Host "CREATED_IMAGE_SUCCESS"
