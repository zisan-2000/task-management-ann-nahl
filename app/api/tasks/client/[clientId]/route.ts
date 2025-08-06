// import { promises as fs } from "fs";
// import path from "path";
// import { type NextRequest, NextResponse } from "next/server";

// // Type Definitions (copied from the original component for consistency)
// type TaskStatus = "pending" | "inProgress" | "completed" | "unassigned";
// type TaskCategory = "social" | "content" | "design";
// type TaskPriority = "high" | "medium" | "low";

// type Task = {
//   id: string;
//   name: string;
//   category: TaskCategory;
//   priority: TaskPriority;
//   dueDate: string;
//   assignedTo: {
//     id: string;
//     name: string;
//     avatar: string;
//     role: string;
//   } | null;
//   status: TaskStatus;
//   comments: {
//     id: string;
//     text: string;
//     author: string;
//     date: string;
//     avatar: string;
//   }[];
//   reports: {
//     id: string;
//     text: string;
//     author: string;
//     date: string;
//     avatar: string;
//     severity: "high" | "medium" | "low";
//   }[];
// };

// type TeamMember = {
//   id: string;
//   name: string;
//   email: string;
//   avatar: string;
//   role: string;
//   team: string;
//   assignedDate: string;
//   assignedTasks: number;
//   completedTasks: number;
//   lateTasks: number;
// };

// // Client data structure from clients.json, now including tasks
// type Client = {
//   id: string;
//   name: string;
//   company: string;
//   designation: string;
//   avatar: string;
//   progress: number;
//   status: string;
//   package: string;
//   startDate: string;
//   dueDate: string;
//   totalTasks: number;
//   completedTasks: number;
//   pendingTasks: number;
//   inProgressTasks: number;
//   hasNewComments: boolean;
//   hasIssues: boolean;
//   teamMembers: TeamMember[];
//   tasks: {
//     pending: Task[];
//     inProgress: Task[];
//     completed: Task[];
//     unassigned: Task[];
//   };
//   isOverdue?: boolean;
// };

// // Combined ClientData type for the frontend (matches the Client type above)
// type ClientData = Client;

// const CLIENTS_FILE_PATH = path.join(process.cwd(), "data", "clients.json");

// async function readClientsData(): Promise<Client[]> {
//   try {
//     const fileContents = await fs.readFile(CLIENTS_FILE_PATH, "utf8");
//     return JSON.parse(fileContents);
//   } catch (error) {
//     console.error("Error reading clients.json:", error);
//     return [];
//   }
// }

// async function writeClientsData(data: Client[]): Promise<void> {
//   await fs.writeFile(CLIENTS_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
// }

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { clientId: string } }
// ) {
//   const { clientId } = params;

//   const allClientsData = await readClientsData();
//   const clientData = allClientsData.find((client) => client.id === clientId);

//   if (!clientData) {
//     return NextResponse.json(
//       { message: "Client data not found" },
//       { status: 404 }
//     );
//   }

//   const isOverdue = new Date() > new Date(clientData.dueDate);

//   const combinedClientData: ClientData & { isOverdue: boolean } = {
//     ...clientData,
//     isOverdue,
//   };

//   return NextResponse.json(combinedClientData);
// }


// export async function POST(
//   request: NextRequest,
//   { params }: { params: { clientId: string } }
// ) {
//   const { clientId } = params;
//   const newTask: Task = await request.json();

//   const allClientsData = await readClientsData();
//   const clientIndex = allClientsData.findIndex(
//     (client) => client.id === clientId
//   );

//   if (clientIndex === -1) {
//     return NextResponse.json({ message: "Client not found" }, { status: 404 });
//   }

//   // Ensure the tasks object exists for the client
//   if (!allClientsData[clientIndex].tasks) {
//     allClientsData[clientIndex].tasks = {
//       pending: [],
//       inProgress: [],
//       completed: [],
//       unassigned: [],
//     };
//   }

//   // Add the new task to the unassigned list for the specific client
//   allClientsData[clientIndex].tasks.unassigned.push(newTask);

//   await writeClientsData(allClientsData);

//   return NextResponse.json(newTask, { status: 201 });
// }

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { clientId: string } }
// ) {
//   const { clientId } = params;
//   const updatedClientTasks: Client["tasks"] = await request.json(); // Expecting only the tasks object

//   const allClientsData = await readClientsData();
//   const clientIndex = allClientsData.findIndex(
//     (client) => client.id === clientId
//   );

//   if (clientIndex === -1) {
//     return NextResponse.json(
//       { message: "Client tasks data not found" },
//       { status: 404 }
//     );
//   }

//   // Overwrite the tasks for the specific client
//   allClientsData[clientIndex].tasks = updatedClientTasks;

//   await writeClientsData(allClientsData);

//   return NextResponse.json({ message: "Tasks updated successfully" });
// }













import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { clientId: string } }) {
  try {
    const { clientId } = params

    const tasks = await prisma.task.findMany({
      where: {
        clientId: clientId,
      },
      include: {
        templateSiteAsset: {
          select: {
            id: true,
            name: true,
            type: true,
            description: true,
            url: true,
            isRequired: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            category: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ templateSiteAsset: { type: "asc" } }, { priority: "desc" }, { dueDate: "asc" }],
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching client tasks:", error)
    return NextResponse.json({ message: "Failed to fetch client tasks" }, { status: 500 })
  }
}
