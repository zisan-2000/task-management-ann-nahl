import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, AlertCircle } from "lucide-react";

interface Task {
  id: number;
  title: string;
  dueDate: string;
  priority: string;
  status: string;
  assignedTo: {
    id: number;
    name: string;
    avatar: string;
  } | null;
}

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const priorityColor =
    {
      High: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      Medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      Low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    }[task.priority] || "bg-gray-100 text-gray-800";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary rounded-none rounded-r-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold">
            {task.title}
          </CardTitle>
          <Badge className={priorityColor}>{task.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-1" />
          <span>Due: {formatDate(task.dueDate)}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <Badge variant="outline">{task.status}</Badge>
        {task.assignedTo ? (
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">
              Assigned to:
            </span>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={task.assignedTo.avatar}
                alt={task.assignedTo.name}
              />
              <AvatarFallback>
                {task.assignedTo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Unassigned</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
