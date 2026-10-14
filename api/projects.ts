import { apiClient } from "./client";

import type {
  Project,
  ProjectDetail,
  ProjectFilters,
  ProjectFormInput,
  ProjectListResponse,
  ProjectRemark,
  ProjectStatus,
  ProjectSummary,
  UpdateProjectInput,
} from "../types/project";

export async function fetchProjects(
  filters: ProjectFilters = {}
): Promise<ProjectListResponse> {
  const { data } =
    await apiClient.get<ProjectListResponse>(
      "/projects",
      { params: filters }
    );

  return data;
}

export async function fetchProjectSummary(
  assigneeUserId?: number
): Promise<ProjectSummary> {
  const { data } =
    await apiClient.get<ProjectSummary>(
      "/projects/summary",
      {
        params:
          assigneeUserId !== undefined
            ? { assigneeUserId }
            : undefined,
      }
    );

  return data;
}

export async function fetchProject(
  srNo: number
): Promise<ProjectDetail> {
  const { data } =
    await apiClient.get<ProjectDetail>(
      `/projects/${srNo}`
    );

  return data;
}

export async function createProject(
  input: ProjectFormInput
): Promise<Project> {
  const { data } =
    await apiClient.post<Project>(
      "/projects",
      input
    );

  return data;
}

export async function updateProject(
  srNo: number,
  input: UpdateProjectInput
): Promise<Project> {
  const { data } =
    await apiClient.put<Project>(
      `/projects/${srNo}`,
      input
    );

  return data;
}

export async function updateProjectStatus(
  srNo: number,
  status: ProjectStatus
): Promise<Project> {
  const { data } =
    await apiClient.patch<Project>(
      `/projects/${srNo}/status`,
      { status }
    );

  return data;
}

export async function deleteProject(
  srNo: number
): Promise<void> {
  await apiClient.delete(
    `/projects/${srNo}`
  );
}

export async function addProjectRemark(
  srNo: number,
  body: string,
  remarkDate?: string
): Promise<ProjectRemark> {
  const { data } =
    await apiClient.post<ProjectRemark>(
      `/projects/${srNo}/remarks`,
      {
        body,
        ...(remarkDate
          ? { remarkDate }
          : {}),
      }
    );

  return data;
}

export async function updateProjectRemarkHighlight(
  srNo: number,
  remarkId: number,
  highlighted: boolean
): Promise<ProjectRemark> {
  const { data } =
    await apiClient.patch<ProjectRemark>(
      `/projects/${srNo}/remarks/${remarkId}/highlight`,
      { highlighted }
    );

  return data;
}
