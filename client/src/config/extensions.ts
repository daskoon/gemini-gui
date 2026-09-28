import { 
  LayoutTemplate, 
  Workflow, 
  Database, 
  Globe, 
  Search, 
  Share2, 
  Code2,
  Cpu
} from 'lucide-react';

export interface ExtensionAction {
  label: string;
  command: string;
  description: string;
  dangerous?: boolean;
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'dev' | 'ops' | 'design' | 'utility';
  actions: ExtensionAction[];
}

export const EXTENSIONS: Extension[] = [
  {
    id: 'blueprint',
    name: 'Blueprint',
    description: 'Project planning and workflow management.',
    icon: Workflow,
    category: 'dev',
    actions: [
      { label: 'Create Plan', command: '/workflow:plan', description: 'Create a new development plan' },
      { label: 'Run Tests', command: '/workflow:test', description: 'Run project tests' },
      { label: 'Implement', command: '/workflow:act', description: 'Execute the current plan' },
    ]
  },
  {
    id: 'dev-flow',
    name: 'Dev Flow',
    description: 'Structured feature development.',
    icon: Code2,
    category: 'dev',
    actions: [
      { label: 'New Feature (PRD)', command: '/dev:create-prd', description: 'Draft requirements for a new feature' },
      { label: 'Generate Tasks', command: '/dev:generate-tasks', description: 'Break down PRD into tasks' },
      { label: 'Start Coding', command: '/dev:process-task-list', description: 'Begin implementation' },
    ]
  },
  {
    id: 'firebase',
    name: 'Firebase',
    description: 'Backend services and deployment.',
    icon: Database,
    category: 'ops',
    actions: [
      { label: 'Init Project', command: '/firebase:init', description: 'Initialize Firebase services' },
      { label: 'Deploy App', command: '/firebase:deploy', description: 'Deploy to hosting', dangerous: true },
      { label: 'List Projects', command: '/firebase:list-projects', description: 'Show available projects' },
    ]
  },
  {
    id: 'cloud-run',
    name: 'Cloud Run',
    description: 'Serverless container deployment.',
    icon: Globe,
    category: 'ops',
    actions: [
      { label: 'Deploy Local', command: '/cloud-run:deploy', description: 'Deploy current folder' },
      { label: 'List Services', command: '/cloud-run:services', description: 'Show active services' },
    ]
  },
  {
    id: 'design-lab',
    name: 'Design Lab',
    description: 'UI/UX design exploration.',
    icon: LayoutTemplate,
    category: 'design',
    actions: [
      { label: 'Start Session', command: '/design:start', description: 'Begin a new design session' },
      { label: 'Review', command: '/design:review', description: 'Review generated designs' },
    ]
  },
  {
    id: 'gemini-kit',
    name: 'Team Gemini',
    description: 'AI Agent specialized team.',
    icon: Cpu,
    category: 'dev',
    actions: [
      { label: 'Assign Team', command: '/kit:start', description: 'Start a team session' },
      { label: 'Status', command: '/kit:status', description: 'Check team status' },
    ]
  },
  {
    id: 'open-aware',
    name: 'Research',
    description: 'Open source code intelligence.',
    icon: Search,
    category: 'utility',
    actions: [
      { label: 'Search Repos', command: '/open-aware:search', description: 'Find relevant code' },
      { label: 'Deep Research', command: '/open-aware:research', description: 'Analyze codebase patterns' },
    ]
  },
  {
    id: 'screenshare',
    name: 'Vision',
    description: 'Screen sharing and analysis.',
    icon: Share2,
    category: 'utility',
    actions: [
      { label: 'Start Sharing', command: '/screenshare:start', description: 'Share screen with Gemini' },
      { label: 'Capture', command: '/screenshare:capture', description: 'Take a screenshot' },
    ]
  },
];
