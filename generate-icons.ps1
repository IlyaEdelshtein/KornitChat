# PowerShell script to generate simple PNG icons
Add-Type -AssemblyName System.Drawing

function Create-Icon {
    param(
        [int]$Size,
        [string]$OutputPath
    )
    
    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fill background with blue
    $blueBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 118, 210))
    $graphics.FillRectangle($blueBrush, 0, 0, $Size, $Size)
    
    # Add white "AI" text
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $font = New-Object System.Drawing.Font("Arial", ($Size / 4), [System.Drawing.FontStyle]::Bold)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    
    $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
    $graphics.DrawString("AI", $font, $whiteBrush, $rect, $format)
    
    # Save as PNG
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $blueBrush.Dispose()
    $whiteBrush.Dispose()
    $font.Dispose()
    $format.Dispose()
}

# Generate icons
Create-Icon -Size 192 -OutputPath "pwa-192x192.png"
Create-Icon -Size 512 -OutputPath "pwa-512x512.png"
Create-Icon -Size 180 -OutputPath "apple-touch-icon.png"

Write-Host "Icons generated successfully!"
