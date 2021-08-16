import { Model } from "@shared/types/Model";

type ModelInJson = Omit<Model, "files">;

export type ModelsJson = ModelInJson[];
