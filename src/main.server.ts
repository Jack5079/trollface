import { Players, Workspace, RunService } from '@rbxts/services'


// //====================================================\\
//                    OPTIONS
// \\====================================================//
const char = script.Parent as Model & {
  Head: Part
  HumanoidRootPart: Part & {
    Front: Decal
    Back: Decal
  }
  Humanoid: Humanoid
}
const plr = Players.GetPlayerFromCharacter(char) as Player

const inputRemote: RemoteEvent<(name: string, state: Enum.UserInputState, obj: InputObject, cframe: CFrame) => void> = new Instance('RemoteEvent', char)
inputRemote.Name = 'input'

// //====================================================\\
//                    MUSIC
// \\====================================================//
const sound = new Instance('Sound', char.HumanoidRootPart)
sound.Volume = 1
sound.SoundId = 'rbxassetid://131556035'
sound.Looped = true
sound.Play()
// //====================================================\\
//                    FUNNY IRONY
// \\====================================================//
for (const instance of char.GetChildren().filter(inst => inst.IsA('Accessory'))) instance.Destroy() // remove hats/wings/whatever
for (const instance of char.GetChildren().filter(inst => inst.IsA('Part')) as Part[]) instance.Transparency = 1 // hide everything

// remove face
const face = char.Head.FindFirstChild('face')
if (face) face.Destroy()

// add troll texture
for (const side of [Enum.NormalId.Front, Enum.NormalId.Back]) {
  const decal = new Instance('Decal', char.HumanoidRootPart)
  decal.Texture = 'rbxassetid://2005276185'
  decal.Face = side
  decal.Name = side.Name
}
char.HumanoidRootPart.Transparency = 0
char.HumanoidRootPart.Color = new Color3(1, 1, 1)

// //====================================================\\
//                    ANTI-DEATH
// \\====================================================//
char.Humanoid.MaxHealth = math.huge
char.Humanoid.Health = math.huge
char.Humanoid.HealthChanged.Connect(() => {
  char.Humanoid.MaxHealth = math.huge
  char.Humanoid.Health = math.huge
})
char.Humanoid.Name = ''
new Instance('ForceField', char).Visible = false

// Anti-Banish
// ironically taken from a banisher
const Shield = new Instance("MeshPart", Workspace)
Shield.CanCollide = false
Shield.Transparency = 1
Shield.Material = Enum.Material.Neon
Shield.Size = new Vector3(5.3, 6.3, 5.3)
Shield.CFrame = char.HumanoidRootPart.CFrame
const Wed = new Instance("Weld", Shield)
Wed.Part0 = Shield
Wed.Part1 = char.HumanoidRootPart

// //====================================================\\
//                    INPUT HANDLER
// \\====================================================//
async function handler (requestingPlayer: Player, name: string, state: Enum.UserInputState) {
  // Ignore unfunny
  if (requestingPlayer !== plr) return

  if (name === 'Oil' && state === Enum.UserInputState.Begin) {
    // cover in oil
    char.HumanoidRootPart.Front.Color3 = new Color3(0, 1, 0)
    char.HumanoidRootPart.Back.Color3 = new Color3(0, 1, 0)
    char.HumanoidRootPart.Color = new Color3(0, 1, 0)
    const fly = new Instance('BodyVelocity', char.HumanoidRootPart)
    fly.MaxForce = new Vector3(0, math.huge, 0)
    fly.P = math.huge
    fly.Velocity = new Vector3(0, 50, 0)
  }
  if (name === 'Oil' && state === Enum.UserInputState.End) {
    // uncover in oil
    char.HumanoidRootPart["Front"].Color3 = new Color3(1, 1, 1)
    char.HumanoidRootPart["Back"].Color3 = new Color3(1, 1, 1)
    char.HumanoidRootPart.Color = new Color3(1, 1, 1)
    const maybeABodyVel = char.HumanoidRootPart.WaitForChild('BodyVelocity')
    if (maybeABodyVel) maybeABodyVel.Destroy()
  }
}

inputRemote.OnServerEvent.Connect(handler as Callback)
