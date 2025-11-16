'use client';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from '@/components/ui/kanban';
import { GripVertical } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  assignee?: string;
  assigneeAvatar?: string;
  dueDate?: string;
}

const COLUMN_TITLES: Record<string, string> = {
  backlog: 'Backlog',
  inProgress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

interface TaskCardProps extends Omit<React.ComponentProps<typeof KanbanItem>, 'value' | 'children'> {
  task: Task;
  asHandle?: boolean;
}

function TaskCard({ task, asHandle, ...props }: TaskCardProps) {
  const cardContent = (
    <div className="kanban-task-card rounded-md border p-2.5 shadow-xs" style={{ backgroundColor: '#0C0A09', borderColor: '#2a2a2a', color: 'white' }}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="line-clamp-1 font-medium text-sm text-white">{task.title}</span>
          <Badge
            variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'primary' : 'warning'}
            appearance="outline"
            className="pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize shrink-0"
          >
            {task.priority}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-gray-400 text-xs">
          {task.assignee && (
            <div className="flex items-center gap-1">
              <Avatar className="size-4">
                <AvatarImage src={task.assigneeAvatar} />
                <AvatarFallback>{task.assignee.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="line-clamp-1 text-white">{task.assignee}</span>
            </div>
          )}
          {task.dueDate && <time className="text-[10px] tabular-nums whitespace-nowrap text-gray-400">{task.dueDate}</time>}
        </div>
      </div>
    </div>
  );
  return (
    <KanbanItem value={task.id} {...props}>
      {asHandle ? <KanbanItemHandle>{cardContent}</KanbanItemHandle> : cardContent}
    </KanbanItem>
  );
}

interface TaskColumnProps extends Omit<React.ComponentProps<typeof KanbanColumn>, 'children'> {
  tasks: Task[];
  isOverlay?: boolean;
}

function TaskColumn({ value, tasks, isOverlay, ...props }: TaskColumnProps) {
  return (
    <KanbanColumn value={value} {...props} className="kanban-column rounded-md border bg-card p-2.5 shadow-xs">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm">{COLUMN_TITLES[value]}</span>
          <Badge variant="secondary">{tasks.length}</Badge>
        </div>
        <KanbanColumnHandle asChild>
          <Button variant="dim" size="sm" mode="icon">
            <GripVertical />
          </Button>
        </KanbanColumnHandle>
      </div>
      <KanbanColumnContent value={value} className="flex flex-col gap-2.5 p-0.5">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} asHandle={!isOverlay} />
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}

export default function KanbanBoardComponent() {
  const [columns, setColumns] = React.useState<Record<string, Task[]>>({
    backlog: [
      {
        id: '1',
        title: 'Add authentication',
        priority: 'high',
        assignee: 'Madoka',
        assigneeAvatar: '/madoka.png',
        dueDate: 'Jan 10, 2025',
      },
      {
        id: '2',
        title: 'Create API endpoints',
        priority: 'medium',
        assignee: 'Jemmdev',
        assigneeAvatar: '/madoka.png',
        dueDate: 'Jan 15, 2025',
      },
      {
        id: '3',
        title: 'Write documentation',
        priority: 'low',
        assignee: 'Senridev',
        assigneeAvatar: '/madoka.png',
        dueDate: 'Jan 20, 2025',
      },
    ],
    inProgress: [
      {
        id: '4',
        title: 'Design system updates',
        priority: 'high',
        assignee: 'Henrydev',
        assigneeAvatar: '/madoka.png',
        dueDate: 'Jan 25, 2025',
      },
      {
        id: '5',
        title: 'Implement dark mode',
        priority: 'medium',
        assignee: 'HenryM',
        assigneeAvatar: '/madoka.png',
        dueDate: 'Jan 25, 2025',
      },
    ],
    review: [
      {
        id: '6',
        title: 'Code review PR #123',
        priority: 'high',
        assignee: 'Henry Matthews',
        assigneeAvatar: '/madoka.png',
        dueDate: 'Jan 18, 2025',
      },
    ],
    done: [
      {
        id: '7',
        title: 'Setup project',
        priority: 'high',
        assignee: 'JosephM',
        assigneeAvatar: '/madoka.png',
        dueDate: 'Jan 5, 2025',
      },
      {
        id: '8',
        title: 'Initial commit',
        priority: 'low',
        assignee: 'Senridev',
        assigneeAvatar: '/madoka.png',
        dueDate: 'Jan 1, 2025',
      },
    ],
  });

  return (
    <div className="kanban-wrapper w-full">
      <Kanban value={columns} onValueChange={setColumns} getItemValue={(item) => item.id}>
        <KanbanBoard className="kanban-board grid auto-rows-fr grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(columns).map(([columnValue, tasks]) => (
            <TaskColumn key={columnValue} value={columnValue} tasks={tasks} />
          ))}
        </KanbanBoard>
        <KanbanOverlay>
          {({ value, variant }) => {
            if (variant === 'column') {
              const tasks = columns[value] ?? [];
              return <TaskColumn value={String(value)} tasks={tasks} isOverlay />;
            }
            const task = Object.values(columns)
              .flat()
              .find((task) => task.id === value);
            if (!task) return null;
            return <TaskCard task={task} />;
          }}
        </KanbanOverlay>
      </Kanban>
    </div>
  );
}