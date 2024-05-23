const APIURL: string = import.meta.env.NB_OPENNEURO_UPLOAD_API;
export const updateURL: string = APIURL.endsWith('/')
  ? `${APIURL}openneuro/upload?dataset_id`
  : `${APIURL}/openneuro/upload?dataset_id`;
