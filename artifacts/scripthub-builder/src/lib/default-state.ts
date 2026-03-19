import { HubConfig, generateId } from './types';

const tab1Id = generateId();
const tab2Id = generateId();
const tab3Id = generateId();
const tab4Id = generateId();

export const defaultState: HubConfig = {
  name: "Neon Hub V1",
  theme: {
    preset: 'neon-purple',
    accent: '#a855f7',
    bg: '#1a1a24',
    bgAlt: '#2d2d3b',
    borderRadius: 10,
    opacity: 100,
    titleColor: '#ffffff',
    font: 'GothamBold',
    width: 560,
    height: 460,
  },
  activeTabId: tab1Id,
  tabs: [
    {
      id: tab1Id,
      name: "Player",
      elements: [
        {
          id: generateId(), type: "notification", label: "Welcome",
          title: "Neon Hub V1", message: "Hub loaded! Use RightAlt to toggle.",
          duration: 5, notifType: "info", trigger: "hub-load"
        },
        { id: generateId(), type: "section", label: "Movement" },
        {
          id: generateId(), type: "slider", label: "Walk Speed",
          min: 16, max: 500, defaultValue: 16,
          code: `local char = game.Players.LocalPlayer.Character
if char and char:FindFirstChild("Humanoid") then
    char.Humanoid.WalkSpeed = value
end`
        },
        {
          id: generateId(), type: "slider", label: "Jump Power",
          min: 50, max: 500, defaultValue: 50,
          code: `local char = game.Players.LocalPlayer.Character
if char and char:FindFirstChild("Humanoid") then
    char.Humanoid.JumpPower = value
end`
        },
        {
          id: generateId(), type: "toggle", label: "Infinite Jump",
          defaultState: false,
          codeOn: `local UIS = game:GetService("UserInputService")
local char = game.Players.LocalPlayer.Character or game.Players.LocalPlayer.CharacterAdded:Wait()
_G.InfJumpConn = UIS.JumpRequest:Connect(function()
    if char and char:FindFirstChild("Humanoid") then
        char.Humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
    end
end)
game:GetService("StarterGui"):SetCore("SendNotification",{Title="Infinite Jump",Text="Enabled!",Duration=2})`,
          codeOff: `if _G.InfJumpConn then
    _G.InfJumpConn:Disconnect()
    _G.InfJumpConn = nil
end
game:GetService("StarterGui"):SetCore("SendNotification",{Title="Infinite Jump",Text="Disabled",Duration=2})`
        },
        {
          id: generateId(), type: "toggle", label: "Fly",
          defaultState: false,
          codeOn: `local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local UIS = game:GetService("UserInputService")
local lp = Players.LocalPlayer
local char = lp.Character or lp.CharacterAdded:Wait()
local hrp = char:WaitForChild("HumanoidRootPart")
local hum = char:WaitForChild("Humanoid")
hum.PlatformStand = true
local bv = Instance.new("BodyVelocity", hrp)
bv.Velocity = Vector3.new(0,0,0)
bv.MaxForce = Vector3.new(1e9,1e9,1e9)
local bg = Instance.new("BodyGyro", hrp)
bg.MaxTorque = Vector3.new(1e9,1e9,1e9)
bg.P = 1e4
local speed = 50
_G.FlyConn = RunService.Heartbeat:Connect(function()
    if not char or not char.Parent then return end
    local cam = workspace.CurrentCamera
    local dir = Vector3.new(0,0,0)
    if UIS:IsKeyDown(Enum.KeyCode.W) then dir = dir + cam.CFrame.LookVector end
    if UIS:IsKeyDown(Enum.KeyCode.S) then dir = dir - cam.CFrame.LookVector end
    if UIS:IsKeyDown(Enum.KeyCode.A) then dir = dir - cam.CFrame.RightVector end
    if UIS:IsKeyDown(Enum.KeyCode.D) then dir = dir + cam.CFrame.RightVector end
    if UIS:IsKeyDown(Enum.KeyCode.Space) then dir = dir + Vector3.new(0,1,0) end
    if UIS:IsKeyDown(Enum.KeyCode.LeftControl) then dir = dir - Vector3.new(0,1,0) end
    bv.Velocity = dir * speed
    bg.CFrame = cam.CFrame
end)
game:GetService("StarterGui"):SetCore("SendNotification",{Title="Fly",Text="WASD+Space to fly!",Duration=3})`,
          codeOff: `if _G.FlyConn then _G.FlyConn:Disconnect(); _G.FlyConn = nil end
local char = game.Players.LocalPlayer.Character
if char then
    local hrp = char:FindFirstChild("HumanoidRootPart")
    if hrp then
        if hrp:FindFirstChild("BodyVelocity") then hrp.BodyVelocity:Destroy() end
        if hrp:FindFirstChild("BodyGyro") then hrp.BodyGyro:Destroy() end
    end
    local hum = char:FindFirstChild("Humanoid")
    if hum then hum.PlatformStand = false end
end`
        },
        { id: generateId(), type: "section", label: "Character" },
        {
          id: generateId(), type: "toggle", label: "Noclip",
          defaultState: false,
          codeOn: `local RunService = game:GetService("RunService")
_G.NoclipConn = RunService.Stepped:Connect(function()
    local char = game.Players.LocalPlayer.Character
    if not char then return end
    for _, v in pairs(char:GetDescendants()) do
        if v:IsA("BasePart") then v.CanCollide = false end
    end
end)
game:GetService("StarterGui"):SetCore("SendNotification",{Title="Noclip",Text="Walk through walls!",Duration=2})`,
          codeOff: `if _G.NoclipConn then _G.NoclipConn:Disconnect(); _G.NoclipConn = nil end
local char = game.Players.LocalPlayer.Character
if char then
    for _, v in pairs(char:GetDescendants()) do
        if v:IsA("BasePart") then v.CanCollide = true end
    end
end`
        },
        {
          id: generateId(), type: "toggle", label: "God Mode",
          defaultState: false,
          codeOn: `local char = game.Players.LocalPlayer.Character
local hum = char and char:FindFirstChild("Humanoid")
if hum then
    hum.MaxHealth = math.huge
    hum.Health = math.huge
    _G.GodConn = hum.HealthChanged:Connect(function()
        hum.Health = math.huge
    end)
end
game:GetService("StarterGui"):SetCore("SendNotification",{Title="God Mode",Text="You are immortal!",Duration=2})`,
          codeOff: `if _G.GodConn then _G.GodConn:Disconnect(); _G.GodConn = nil end
local char = game.Players.LocalPlayer.Character
if char and char:FindFirstChild("Humanoid") then
    char.Humanoid.MaxHealth = 100
    char.Humanoid.Health = 100
end`
        }
      ]
    },
    {
      id: tab2Id,
      name: "Visuals",
      elements: [
        { id: generateId(), type: "section", label: "Player ESP" },
        {
          id: generateId(), type: "toggle", label: "Player Tracers",
          defaultState: false,
          codeOn: `local Players = game:GetService("Players")
local Camera = workspace.CurrentCamera
local lp = Players.LocalPlayer
local drawings = {}
_G.TracerConn = game:GetService("RunService").RenderStepped:Connect(function()
    for _, d in pairs(drawings) do pcall(function() d:Remove() end) end
    drawings = {}
    for _, p in pairs(Players:GetPlayers()) do
        if p ~= lp and p.Character then
            local hrp = p.Character:FindFirstChild("HumanoidRootPart")
            if hrp then
                local pos, vis = Camera:WorldToViewportPoint(hrp.Position)
                if vis then
                    local line = Drawing.new("Line")
                    line.Visible = true
                    line.From = Vector2.new(Camera.ViewportSize.X / 2, Camera.ViewportSize.Y)
                    line.To = Vector2.new(pos.X, pos.Y)
                    line.Color = Color3.fromRGB(255, 50, 50)
                    line.Thickness = 1.5
                    table.insert(drawings, line)
                end
            end
        end
    end
end)
game:GetService("StarterGui"):SetCore("SendNotification",{Title="Tracers",Text="Player tracers enabled!",Duration=2})`,
          codeOff: `if _G.TracerConn then _G.TracerConn:Disconnect(); _G.TracerConn = nil end`
        },
        {
          id: generateId(), type: "toggle", label: "Player ESP",
          defaultState: false,
          codeOn: `local Players = game:GetService("Players")
local Camera = workspace.CurrentCamera
local lp = Players.LocalPlayer
local espObjs = {}
local function makeESP(p)
    local box = Drawing.new("Square"); box.Visible = false; box.Thickness = 1.5
    box.Filled = false; box.Color = Color3.fromRGB(255, 50, 50)
    local name = Drawing.new("Text"); name.Visible = false; name.Size = 13
    name.Center = true; name.Outline = true; name.Color = Color3.fromRGB(255,255,255)
    espObjs[p.Name] = {box=box, name=name}
end
for _, p in pairs(Players:GetPlayers()) do if p ~= lp then makeESP(p) end end
_G.ESPAdded = Players.PlayerAdded:Connect(function(p) makeESP(p) end)
_G.ESPRemoving = Players.PlayerRemoving:Connect(function(p)
    if espObjs[p.Name] then espObjs[p.Name].box:Remove(); espObjs[p.Name].name:Remove(); espObjs[p.Name]=nil end
end)
_G.ESPConn = game:GetService("RunService").RenderStepped:Connect(function()
    for _, p in pairs(Players:GetPlayers()) do
        if p ~= lp and espObjs[p.Name] and p.Character then
            local hrp = p.Character:FindFirstChild("HumanoidRootPart")
            local hum = p.Character:FindFirstChild("Humanoid")
            if hrp and hum then
                local pos, vis = Camera:WorldToViewportPoint(hrp.Position)
                espObjs[p.Name].box.Visible = vis
                espObjs[p.Name].name.Visible = vis
                if vis then
                    local sz = 60 / pos.Z
                    espObjs[p.Name].box.Position = Vector2.new(pos.X-sz/2, pos.Y-sz)
                    espObjs[p.Name].box.Size = Vector2.new(sz, sz*2)
                    espObjs[p.Name].name.Position = Vector2.new(pos.X, pos.Y-sz-15)
                    espObjs[p.Name].name.Text = p.Name.." ["..math.floor(hum.Health).."]"
                end
            end
        end
    end
end)
game:GetService("StarterGui"):SetCore("SendNotification",{Title="ESP",Text="Player ESP enabled!",Duration=2})`,
          codeOff: `if _G.ESPConn then _G.ESPConn:Disconnect(); _G.ESPConn=nil end
if _G.ESPAdded then _G.ESPAdded:Disconnect() end
if _G.ESPRemoving then _G.ESPRemoving:Disconnect() end`
        },
        { id: generateId(), type: "section", label: "World" },
        {
          id: generateId(), type: "toggle", label: "Fullbright",
          defaultState: false,
          codeOn: `local L = game:GetService("Lighting")
_G.OldBrightness=L.Brightness; _G.OldAmbient=L.Ambient; _G.OldOutdoor=L.OutdoorAmbient
L.Brightness=2; L.Ambient=Color3.new(1,1,1); L.OutdoorAmbient=Color3.new(1,1,1)
for _,v in pairs(L:GetChildren()) do
    if v:IsA("BlurEffect") or v:IsA("ColorCorrectionEffect") then v.Enabled=false end
end
game:GetService("StarterGui"):SetCore("SendNotification",{Title="Fullbright",Text="Enabled!",Duration=2})`,
          codeOff: `local L = game:GetService("Lighting")
L.Brightness=_G.OldBrightness or 1
L.Ambient=_G.OldAmbient or Color3.new(0.5,0.5,0.5)
L.OutdoorAmbient=_G.OldOutdoor or Color3.new(0.5,0.5,0.5)
for _,v in pairs(L:GetChildren()) do
    if v:IsA("BlurEffect") or v:IsA("ColorCorrectionEffect") then v.Enabled=true end
end`
        },
        {
          id: generateId(), type: "slider", label: "Time of Day",
          min: 0, max: 24, defaultValue: 14,
          code: `game:GetService("Lighting").TimeOfDay = value .. ":00:00"`
        },
        {
          id: generateId(), type: "slider", label: "FOV",
          min: 30, max: 120, defaultValue: 70,
          code: `workspace.CurrentCamera.FieldOfView = value`
        }
      ]
    },
    {
      id: tab3Id,
      name: "Teleport",
      elements: [
        { id: generateId(), type: "section", label: "Quick Teleport" },
        {
          id: generateId(), type: "button", label: "Teleport to Spawn",
          code: `local char = game.Players.LocalPlayer.Character
if char then
    local spawnLoc = workspace:FindFirstChildOfClass("SpawnLocation")
    if spawnLoc then
        char:MoveTo(spawnLoc.Position + Vector3.new(0,5,0))
        game:GetService("StarterGui"):SetCore("SendNotification",{Title="Teleport",Text="Teleported to spawn!",Duration=2})
    end
end`
        },
        {
          id: generateId(), type: "button", label: "Float Up 50 Studs",
          code: `local char = game.Players.LocalPlayer.Character
if char and char:FindFirstChild("HumanoidRootPart") then
    char.HumanoidRootPart.CFrame = char.HumanoidRootPart.CFrame + Vector3.new(0,50,0)
    game:GetService("StarterGui"):SetCore("SendNotification",{Title="Float",Text="Moved up 50 studs!",Duration=2})
end`
        },
        {
          id: generateId(), type: "button", label: "Teleport to Origin (0,0,0)",
          code: `local char = game.Players.LocalPlayer.Character
if char and char:FindFirstChild("HumanoidRootPart") then
    char.HumanoidRootPart.CFrame = CFrame.new(0, 10, 0)
    game:GetService("StarterGui"):SetCore("SendNotification",{Title="Teleport",Text="Teleported to origin!",Duration=2})
end`
        }
      ]
    },
    {
      id: tab4Id,
      name: "Misc",
      elements: [
        { id: generateId(), type: "section", label: "Utilities" },
        {
          id: generateId(), type: "button", label: "Test Notification",
          code: `game:GetService("StarterGui"):SetCore("SendNotification",{
    Title = "Hub Working!",
    Text = "Your script hub is running correctly.",
    Duration = 5
})`
        },
        {
          id: generateId(), type: "toggle", label: "Anti-AFK",
          defaultState: false,
          codeOn: `local VU = game:GetService("VirtualUser")
_G.AntiAFKConn = game:GetService("Players").LocalPlayer.Idled:Connect(function()
    VU:Button2Down(Vector2.new(0,0), workspace.CurrentCamera.CFrame)
    task.wait(1)
    VU:Button2Up(Vector2.new(0,0), workspace.CurrentCamera.CFrame)
end)
game:GetService("StarterGui"):SetCore("SendNotification",{Title="Anti-AFK",Text="Won't get kicked for being idle!",Duration=3})`,
          codeOff: `if _G.AntiAFKConn then _G.AntiAFKConn:Disconnect(); _G.AntiAFKConn=nil end`
        },
        {
          id: generateId(), type: "button", label: "Copy User ID",
          code: `setclipboard(tostring(game.Players.LocalPlayer.UserId))
game:GetService("StarterGui"):SetCore("SendNotification",{Title="Copied!",Text="User ID copied to clipboard",Duration=2})`
        },
        {
          id: generateId(), type: "button", label: "Rejoin Server",
          code: `game:GetService("TeleportService"):Teleport(game.PlaceId, game.Players.LocalPlayer)`
        }
      ]
    }
  ]
};
