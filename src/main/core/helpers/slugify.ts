import * as urlSlug from "url-slug";

const improvedSlugify = (item: string) =>
  urlSlug.convert(item) +
  "-" +
  ((Math.random() * Math.pow(36, 6)) | 0).toString(36);

export { improvedSlugify as slugify };
