export type QuestionOptionType = "text" | "image";

export type QuestionOptionItem = {
  type: QuestionOptionType;
  text?: string;
  imageStorageId?: string;
  imageMeta?: {
    width: number;
    height: number;
    size: number;
    mimeType: string;
  };
  imageUrl?: string;
};

export type QuestionOptionItemTranslation = {
  type: QuestionOptionType;
  text?: string;
};
