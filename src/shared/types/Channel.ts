import { PathAbsToRelParams } from "./ChannelParams";
import { IModelFile, ModelRef, WorkingModel } from "./Model";
import ExampleProject from "./ExampleProject";
import { ClassCreationMessage } from "./class-creation-message";
import PathWithContent from "./ipc-params/path-with-content";
import { SimulationStates } from "./SimulationStates";
import {
  SimulationCountMessage,
  SimulationVisMessage,
  SimulationWorldSizeMessage,
} from "./SimulationMessages";

export enum Channel {
  CHECK_LAST_PATH = "CHECK_LAST_PATH",
  CLEAN_PROJECT = "CLEAN_PROJECT",
  COPY_EXAMPLE_PROJECT = "COPY_EXAMPLE_PROJECT",
  CREATE_CLASS = "CREATE_CLASS",
  CREATE_PROJECT = "CREATE_PROJECT",
  DELETE_FILE_OR_DIR = "DELETE_FILE_OR_DIR",
  DOES_CONFIG_EXIST = "DOES_CONFIG_EXIST",
  DOTNET_NOT_FOUND = "DOTNET_NOT_FOUND",
  FILE_EXISTS = "FILE_EXISTS",
  GET_ALL_EXAMPLE_PROJECTS = "GET_ALL_EXAMPLE_PROJECTS",
  GET_CONFIG_IN_PROJECT = "GET_CONFIG_IN_PROJECT",
  GET_DEFAULT_CONFIG_PATH = "GET_DEFAULT_CONFIG_PATH",
  GET_EXAMPLES_PATH = "GET_EXAMPLES_PATH",
  GET_USER_PROJECT = "GET_USER_PROJECT",
  GET_USER_PROJECTS = "GET_USER_PROJECTS",
  GET_WORKSPACE_PATH = "GET_WORKSPACE_PATH",
  INSTALL_MARS = "INSTALL_MARS",
  MARS_INSTALLED = "MARS_INSTALLED",
  PATH_ABSOLUTE_TO_RELATIVE = "PATH_ABSOLUTE_TO_RELATIVE",
  PROJECT_CREATED = "PROJECT_CREATED",
  PROJECT_RESTORED = "PROJECT_RESTORED",
  PROJECT_INITIALIZED = "PROJECT_INITIALIZED",
  READ_FILE = "READ_FILE",
  RESTART_APP = "RESTART_APP",
  RUN_SIMULATION = "RUN_SIMULATION",
  SHUTDOWN = "SHUTDOWN",
  SIMULATION_COORDS_PROGRESS = "SIMULATION_COORDS_PROGRESS",
  SIMULATION_COUNT_PROGRESS = "SIMULATION_COUNT_PROGRESS",
  SIMULATION_EXITED = "SIMULATION_EXITED",
  SIMULATION_FAILED = "SIMULATION_FAILED",
  SIMULATION_WORLD_SIZES = "SIMULATION_WORLD_SIZES",
  START_LANGUAGE_SERVER = "START_LANGUAGE_SERVER",
  STOP_LANGUAGE_SERVER = "STOP_LANGUAGE_SERVER",
  TERMINATE_SIMULATION = "TERMINATE_SIMULATION",
  URI_TO_NAME = "URI_TO_NAME",
  WRITE_CONFIG_TO_FILE = "WRITE_CONFIG_TO_FILE",
  WRITE_CONTENT_TO_FILE = "WRITE_CONTENT_TO_FILE",
  RESTORE_PROJECT = "RESTORE_PROJECT",
  GET_README_IN_DIR = "GET_README_IN_DIR",
  SHOW_UNSAVED_CHANGES_DIALOG = "SHOW_UNSAVED_CHANGES_DIALOG",
  SHOW_UNSAVEABLE_CHANGES_DIALOG = "SHOW_UNSAVEABLE_CHANGES_DIALOG",
  SERVER_SHUTDOWN = "SERVER_SHUTDOWN",
  SIMULATION_OUTPUT = "SIMULATION_OUTPUT",
  EXIT_APP = "EXIT_APP",
}

export interface ChannelInputMap {
  [Channel.CHECK_LAST_PATH]: string;
  [Channel.CLEAN_PROJECT]: string;
  [Channel.COPY_EXAMPLE_PROJECT]: string;
  [Channel.CREATE_CLASS]: ClassCreationMessage;
  [Channel.CREATE_PROJECT]: string;
  [Channel.DELETE_FILE_OR_DIR]: string;
  [Channel.DOES_CONFIG_EXIST]: string;
  [Channel.DOTNET_NOT_FOUND]: void;
  [Channel.EXIT_APP]: void;
  [Channel.FILE_EXISTS]: string;
  [Channel.GET_ALL_EXAMPLE_PROJECTS]: void;
  [Channel.GET_CONFIG_IN_PROJECT]: string;
  [Channel.GET_DEFAULT_CONFIG_PATH]: string;
  [Channel.GET_EXAMPLES_PATH]: void;
  [Channel.GET_README_IN_DIR]: string;
  [Channel.GET_USER_PROJECT]: ModelRef;
  [Channel.GET_USER_PROJECTS]: void;
  [Channel.GET_WORKSPACE_PATH]: void;
  [Channel.INSTALL_MARS]: string;
  [Channel.MARS_INSTALLED]: void;
  [Channel.PATH_ABSOLUTE_TO_RELATIVE]: PathAbsToRelParams;
  [Channel.PROJECT_CREATED]: void;
  [Channel.PROJECT_INITIALIZED]: void;
  [Channel.PROJECT_RESTORED]: void;
  [Channel.READ_FILE]: string;
  [Channel.RESTART_APP]: void;
  [Channel.RESTORE_PROJECT]: string;
  [Channel.RUN_SIMULATION]: string;
  [Channel.SHUTDOWN]: void;
  [Channel.SERVER_SHUTDOWN]: void;
  [Channel.SHOW_UNSAVED_CHANGES_DIALOG]: void;
  [Channel.SHOW_UNSAVEABLE_CHANGES_DIALOG]: void;
  [Channel.SIMULATION_COORDS_PROGRESS]: void;
  [Channel.SIMULATION_COUNT_PROGRESS]: void;
  [Channel.SIMULATION_EXITED]: void;
  [Channel.SIMULATION_FAILED]: void;
  [Channel.SIMULATION_OUTPUT]: void;
  [Channel.SIMULATION_WORLD_SIZES]: void;
  [Channel.START_LANGUAGE_SERVER]: string;
  [Channel.STOP_LANGUAGE_SERVER]: void;
  [Channel.TERMINATE_SIMULATION]: void;
  [Channel.URI_TO_NAME]: string;
  [Channel.WRITE_CONFIG_TO_FILE]: PathWithContent;
  [Channel.WRITE_CONTENT_TO_FILE]: PathWithContent;
}

export interface ChannelOutputMap {
  [Channel.CHECK_LAST_PATH]: ModelRef | null;
  [Channel.CLEAN_PROJECT]: void;
  [Channel.COPY_EXAMPLE_PROJECT]: ModelRef;
  [Channel.CREATE_CLASS]: IModelFile;
  [Channel.CREATE_PROJECT]: void;
  [Channel.DELETE_FILE_OR_DIR]: boolean;
  [Channel.DOES_CONFIG_EXIST]: boolean;
  [Channel.DOTNET_NOT_FOUND]: void;
  [Channel.EXIT_APP]: void;
  [Channel.FILE_EXISTS]: boolean;
  [Channel.GET_ALL_EXAMPLE_PROJECTS]: ExampleProject[];
  [Channel.GET_CONFIG_IN_PROJECT]: string | null;
  [Channel.GET_DEFAULT_CONFIG_PATH]: string;
  [Channel.GET_EXAMPLES_PATH]: string;
  [Channel.GET_README_IN_DIR]: IModelFile;
  [Channel.GET_USER_PROJECT]: WorkingModel;
  [Channel.GET_USER_PROJECTS]: ModelRef[];
  [Channel.GET_WORKSPACE_PATH]: string;
  [Channel.INSTALL_MARS]: void;
  [Channel.MARS_INSTALLED]: void;
  [Channel.PATH_ABSOLUTE_TO_RELATIVE]: string;
  [Channel.PROJECT_CREATED]: boolean;
  [Channel.PROJECT_INITIALIZED]: void;
  [Channel.PROJECT_RESTORED]: boolean;
  [Channel.READ_FILE]: string;
  [Channel.RESTART_APP]: void;
  [Channel.RESTORE_PROJECT]: void;
  [Channel.RUN_SIMULATION]: void;
  [Channel.SHUTDOWN]: void;
  [Channel.SERVER_SHUTDOWN]: void;
  [Channel.SHOW_UNSAVED_CHANGES_DIALOG]: boolean | null;
  [Channel.SHOW_UNSAVEABLE_CHANGES_DIALOG]: boolean;
  [Channel.SIMULATION_COORDS_PROGRESS]: SimulationVisMessage;
  [Channel.SIMULATION_COUNT_PROGRESS]: SimulationCountMessage;
  [Channel.SIMULATION_EXITED]: SimulationStates;
  [Channel.SIMULATION_FAILED]: string;
  [Channel.SIMULATION_OUTPUT]: string;
  [Channel.SIMULATION_WORLD_SIZES]: SimulationWorldSizeMessage;
  [Channel.START_LANGUAGE_SERVER]: string;
  [Channel.STOP_LANGUAGE_SERVER]: void;
  [Channel.TERMINATE_SIMULATION]: void;
  [Channel.URI_TO_NAME]: string;
  [Channel.WRITE_CONFIG_TO_FILE]: void;
  [Channel.WRITE_CONTENT_TO_FILE]: void;
}
