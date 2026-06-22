import { createFileRoute } from '@tanstack/react-router';
import { CompareSkillsPage } from '../../skills/compare_page';

export const Route = createFileRoute('/skills_/compare')({
  component: CompareSkillsPage,
});
