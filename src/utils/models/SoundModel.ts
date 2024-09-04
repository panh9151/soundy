export type SoundModel = {
  id: string;
  createdAt: string;
  path: string;
  thumbnail: string;
  title: string;
  defaultPlaying: string;
  defaultVolumn: number;
  isPlay: boolean;
  volumn: number;
  lastUpdate: string;
  locationX: number;
  locationY: number;
  type: {
    label: string;
    thumbnail: string;
  };
};
