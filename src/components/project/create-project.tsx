"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/shadcn";
import { toast } from "sonner";
import { useCreateProject, useDeleteProject } from "@/hooks/useProjects";
import { CreateProjectInput } from "@/types/project";

export default function CreateProject() {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    defaultValues: {
      name: "",
      client: "",
      description: "",
      status: "",
    },
  });

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const createProjectMutation = useCreateProject();
  const deleteProjectMutation = useDeleteProject();

  const onSubmit = async (data: CreateProjectInput) => {
    try {
      const input: CreateProjectInput = {
        ...data,
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString(),
      };

      await createProjectMutation.mutateAsync(input);

      toast("Project created successfully.", {
        action: {
          label: "Undo",
          onClick: () => {
            deleteProjectMutation.mutate(input.name);
          },
        },
        onDismiss: () => {
          // Reset form
          reset();
          setStartDate(undefined);
          setEndDate(undefined);
        },
      });
    } catch (error) {
      toast.error("Failed to create project. Please try again.");
    }
  };
  if (deleteProjectMutation.isError) {
    toast.error("Failed to undo Project. ");
    deleteProjectMutation.reset();
  }

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
  };

  return (
    <div className="w-full max-w-2xl">
      <p className="text-muted-foreground mb-6">
        Enter the details for your new project.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            placeholder="Enter project name"
            className={cn("w-full", errors.name && "border-red-500")}
            {...register("name", { required: "Project name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            placeholder="Enter client name"
            className={cn(errors.client && "border-red-500")}
            {...register("client", { required: "Client name is required" })}
          />
          {errors.client && (
            <p className="text-sm text-red-500">{errors.client.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 grid-cols-1">
          <div className="space-y-1">
            <Label>Project Begin</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label>Project End</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="description">Project Description</Label>
          <Textarea
            id="description"
            placeholder="Enter project description"
            className={cn(errors.description && "border-red-500")}
            {...register("description", {
              required: "Project description is required",
            })}
            maxLength={500}
          />
          <div className="text-sm text-muted-foreground text-right mt-1">
            {watch("description")?.length || 0}/500 characters
          </div>
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="status">Project Status</Label>
          <Select
            onValueChange={(value) => setValue("status", value)}
            defaultValue=""
          >
            <SelectTrigger
              id="status"
              className={cn(errors.status && "border-red-500")}
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full !mt-4"
          disabled={createProjectMutation.isPending}
        >
          {createProjectMutation.isPending ? "Creating..." : "Create Project"}
        </Button>
      </form>
    </div>
  );
}
