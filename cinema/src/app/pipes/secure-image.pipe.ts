import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'secureImage'
})
export class SecureImagePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): Observable<unknown> {
    console.log(value)
    return of('sdffsd');
  }


  // async displayProtectedImage(
  //   imageId, imageUrl, authToken
  // ) {
  //   // Fetch the image.
  //   const response = await fetchWithAuthentication(
  //     imageUrl, authToken
  //   );
  
  //   // Convert the data to Base64 and build a data URL.
  //   const binaryData = await response.arrayBuffer();
  //   const base64 = arrayBufferToBase64(binaryData);
  //   const dataUrl = `data:image/png;base64,${base64}`;
  
  //   // Update the source of the image.
  //   const imageElement = getElementById(imageId);
  //   imageElement.src = dataUrl;
  // }

}
