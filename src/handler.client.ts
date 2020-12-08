import { ContextActionService } from '@rbxts/services'
declare const script: LocalScript & { Parent: Model }
const input = script.Parent.WaitForChild('input') as RemoteEvent<(name: string, state: Enum.UserInputState) => void>
const handler = (name: string, state: Enum.UserInputState) => {
  input.FireServer(name, state)
}
ContextActionService.BindAction('Oil', handler, true, Enum.KeyCode.E)
ContextActionService.SetImage('Oil', 'rbxassetid://2005276185')
