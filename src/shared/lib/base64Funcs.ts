export const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject('Cannot convert blob to base64');
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const getBase64FromBlob = async (input: string | Blob): Promise<string> => {
const blob =
    typeof input === 'string' ? await fetch(input).then((res) => res.blob()) : input;
return blobToBase64(blob);
};