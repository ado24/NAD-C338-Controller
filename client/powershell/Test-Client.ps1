class NADC338 {
    [string]$version = '0.1'
    [hashtable]$data = @{}
    [array]$Sources = @('Stream', 'Wireless', 'TV', 'Phono', 'Coax1', 'Coax2', 'Opt1', 'Opt2')
    [int]$bufferSize = 1024
    [System.Net.Sockets.TcpClient]$client
    [System.IO.StreamReader]$reader
    [System.IO.StreamWriter]$writer

    NADC338([string]$ip, [int]$port = 30001) {
        $this.client = [System.Net.Sockets.TcpClient]::new($ip, $port)
        $stream = $this.client.GetStream()
        $this.reader = [System.IO.StreamReader]::new($stream)
        $this.writer = [System.IO.StreamWriter]::new($stream)
        $this.writer.AutoFlush = $true
        $this.data['power'] = $this.GetPower()
    }

    [string]SendCmd([string]$cmd, [bool]$readReply = $false) {
        $this.writer.WriteLine($cmd)
        if ($readReply) {
            return $this.reader.ReadLine().Split('=')[1]
        }
        return $null
    }

    [int]PowerOn() {
        $this.SendCmd('Main.Power=On', $true)
        Start-Sleep -Seconds 8
        $state = if ($this.SendCmd('Main.Power?', $true) -eq 'On') { 1 } else { 0 }
        $this.data['power'] = $state
        return $state
    }

    [int]PowerOff() {
        $state = if ($this.SendCmd('Main.Power=Off', $true) -eq 'On') { 1 } else { 0 }
        $this.data['power'] = $state
        return $state
    }

    [string]Mute() {
        return $this.SendCmd('Main.Mute=On', $true)
    }

    [string]UnMute() {
        return $this.SendCmd('Main.Mute=Off', $true)
    }

    [string]SetVolume([double]$vol = -20) {
        if ($vol -ge -80 -and $vol -le 12) {
            if ($this.data['power'] -eq 'Off') { $this.PowerOn() }
            return $this.SendCmd("Main.Volume=$vol", $true)
        } else {
            return 'Volume must be between -80 and 12 by 0.5 step'
        }
    }

    [string]SetSource([string]$source) {
        if ($this.Sources -contains $source) {
            if ($this.GetSource() -eq $source) { return $source }
            if ($this.data['power'] -eq 'Off') { $this.PowerOn() }
            return $this.SendCmd("Main.Source=$source", $true)
        } else {
            return 'Unavailable Source'
        }
    }

    [int]GetPower() {
        if ($this.SendCmd('Main.Power?', $true) -eq 'On')
        {
            return 1
        } else {
            return 0
        }
    }

    [string]GetVolume() {
        return $this.SendCmd('Main.Volume?', $true)
    }

    [string]GetMute() {
        return $this.SendCmd('Main.Mute?', $true)
    }

    [string]GetSource() {
        return $this.SendCmd('Main.Source?', $true)
    }

    [string]GetBrightness() {
        return $this.SendCmd('Main.Brightness?', $true)
    }

    [string]SetBrightness([int]$level = 2) {
        if ($level -in 0..3) {
            return $this.SendCmd("Main.Brightness=$level", $true)
        } else {
            return 'Set Brightness level of 0 1 2 or 3, 0 being off then low, normal, bright'
        }
    }

    [string]GetBass() {
        return $this.SendCmd('Main.Bass?', $true)
    }

    [string]SetBass() {
        return $this.SendCmd('Main.Bass=On', $true)
    }

    [string]UnsetBass() {
        return $this.SendCmd('Main.Bass=Off', $true)
    }

    [string]GetAutoSense() {
        return $this.SendCmd('Main.AutoSense?', $true)
    }

    [string]SetAutoSense() {
        return $this.SendCmd('Main.AutoSense=On', $true)
    }

    [string]UnsetAutoSense() {
        return $this.SendCmd('Main.AutoSense=Off', $true)
    }

    [string]GetAutoStandby() {
        return $this.SendCmd('Main.AutoStandby?', $true)
    }

    [string]SetAutoStandby() {
        return $this.SendCmd('Main.AutoStandby=On', $true)
    }

    [string]UnsetAutoStandby() {
        return $this.SendCmd('Main.AutoStandby=Off', $true)
    }

    [string]GetVersion() {
        return $this.SendCmd('Main.Version?', $true)
    }
}

# Example usage
[string]$nadIp = "10.0.0.251"
[int]$nadPort = 30001
[double]$desiredVolume = -25.5

$nad = [NADC338]::new($nadIp, $nadPort)
$nad.PowerOn()
$nad.SetVolume($desiredVolume)
#$nad.SetSource('TV')
#$nad.PowerOff()