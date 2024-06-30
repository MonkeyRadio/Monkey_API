export enum DiffusionLinkType {
  AUDIO = "audio",
  VIDEO = "video",
}

export enum DiffusionLinkContainerType {
  HLS = "hls",
  LLHLS = "llhls",
  DASH = "dash",
  RTMP = "rtmp",
  RTSP = "rtsp",
  ICECAST = "icecast",
}

export interface DiffusionLink {
  name: string;
  diffusionLink: string;
  onDemand: boolean;
  containerType: DiffusionLinkContainerType;
  type: DiffusionLinkType;
  quality?: string;
  codec?: string;
  details?: string;
}

export interface OnDemandLink extends DiffusionLink {
  duration: number;
}
