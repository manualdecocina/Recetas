'use client';
import type { MdLanguage, MdStep } from './md-types';
import { getMdCopy } from '@/lib/copy';
import { useRecipeWorkspace } from './RecipeWorkspace';
import StepPhoto from './StepPhoto';
export default function RecipeSteps({ recipeId, lang, steps: originalSteps }: { recipeId: string; lang: MdLanguage; steps: MdStep[] }) {
 const t = getMdCopy(lang), steps = useRecipeWorkspace()?.steps ?? originalSteps;
 return <ol className="md-step-list">{steps.map((step, index) => <li className={`md-step-item${step.image_url ? ' has-photo' : ''}`} id={`paso-${index + 1}`} key={`${recipeId}-step-${index}`}>
  <span className="md-step-count" aria-hidden="true">{index + 1}</span><div className="md-step-text"><h3>{step.title || `${t.step} ${index + 1}`}</h3><p>{step.content}</p></div>
  {step.image_url && <StepPhoto src={step.image_url} alt={step.image_alt || step.title || `${t.step} ${index + 1}`} closeLabel={t.close} />}
 </li>)}</ol>;
}
