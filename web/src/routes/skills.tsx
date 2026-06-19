import { createFileRoute } from '@tanstack/react-router';
import { SkillsPage } from '../skills/skills_page';

export const Route = createFileRoute('/skills')({
  component: SkillsPage,
});
