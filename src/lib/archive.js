import JSZip from 'jszip';

export const fetchImages = async (cdnUrl, slug, imageFiles) => {
  const padLength = imageFiles.length.toString().length;
  const images = {};

  for (const index in imageFiles) {
    const imageFile = imageFiles[index];
    const image = await fetch(`${cdnUrl}/${imageFile}`).then(res => res.blob());

    const imageNo = index.toString().padStart(padLength, '0');
    const outFile = `${slug}-${imageNo + 1}.${imageFile.split('.').pop()}`;
    images[outFile] = image;
  }

  return images;
};

export const generateZip = (images) => {
  const zip = new JSZip;
  Object.entries(images)
    .forEach(([imageFile, image]) => zip.file(imageFile, image));
  return zip.generateAsync({ type: 'blob' });
};

// TODO: PDF
