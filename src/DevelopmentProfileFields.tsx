import { ActionButton as Button, ControlAvailability } from "./ActionButton";
import { dimensionOptions, featureOptions, type DevelopmentProfile } from "./game-development";
import "./DevelopmentProfileFields.css";

export default function DevelopmentProfileFields({ value, onChange, disabled = false }: {
  value: DevelopmentProfile; onChange: (value: DevelopmentProfile) => void; disabled?: boolean;
}) {
  return <div className="development-profile-fields">
    <ControlAvailability disabled={disabled} reason="Wait for this game to finish saving."><fieldset className="game-dimension-field" aria-disabled={disabled}>
      <legend>GAME TYPE</legend>
      <div className="game-dimension-options">{dimensionOptions.map(option => <Button key={option.id} type="button" aria-pressed={value.gameDimension === option.id}
        onClick={() => onChange({ ...value, gameDimension: option.id })}>{option.label}</Button>)}</div>
    </fieldset>
    <details className="game-system-choices">
      <summary><span>GAME SYSTEMS <small>{value.gameplayFeatures.length ? `${value.gameplayFeatures.length} selected` : "Optional"}</small></span>
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </summary>
      <p>Choose the systems your game uses to get practical task recommendations. You can change these later.</p>
      <div className="game-system-options">{featureOptions.map(option => {
        const selected = value.gameplayFeatures.includes(option.id);
        return <Button key={option.id} type="button" disabled={disabled} disabledReason="Wait for this game to finish saving." aria-pressed={selected} onClick={() => onChange({ ...value,
          gameplayFeatures: selected ? value.gameplayFeatures.filter(id => id !== option.id) : [...value.gameplayFeatures, option.id] })}>{option.label}</Button>;
      })}</div>
    </details></ControlAvailability>
    <p className="game-profile-help">This tailors task suggestions. It does not add or remove any tasks in your roadmap.</p>
  </div>;
}
