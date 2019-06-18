import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { UserProvider } from '../../providers/user/user';
import { config } from '../../config/config';

/**
 * Generated class for the EFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-e-form',
  templateUrl: 'e-form.html',
})
export class EFormPage {
  imageToShow: any;
  debugger: any;
  isImageLoading = false;
  isImageError = false;
  hasEform = false;
  defaultImage = "assets/images/defaults/not_found.jpg";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private photoViewer: PhotoViewer,
    private camera: Camera,
    private storage: Storage,
    private transfer: FileTransfer,
    private userProvider: UserProvider
  ) {

    this.getEform();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EFormPage');
  }
  errorImage() {
    this.isImageError = true;
  }

  getEform() {
    this.storage.get("Authorization").then((authToken) => {
      this.isImageLoading = true;
      this.userProvider.getEform(authToken).subscribe((successData) => {
        this.isImageLoading = false;
        if (successData.hasEform) {
          this.hasEform = true;
          this.imageToShow = successData.url;
        } else {
          this.hasEform = false;
          this.imageToShow = successData.url;
        }
      }, (error) => {
        this.isImageLoading = false;
        console.log(error)
      })
    }).catch((error) => console.log(error))
  }

  viewImage(path) {
    let title = "Enrollment Form";
    let options = {
      share: false,
      closeButton: true
    }
    this.photoViewer.show(path, title, options)

  }
  cameraStart() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }
    this.camera.getPicture(options).then((imageData) => {
      this.imageToShow = imageData;


      this.storage.get("Authorization").then((authToken) => {
        const fileTransfer: FileTransferObject = this.transfer.create();

        let options: FileUploadOptions = {
          fileKey: 'image',
          fileName: 'try.jpg',
          chunkedMode: false,
          mimeType: "image/jpeg",
          headers: { authorization: authToken }
        }

        fileTransfer.upload(this.imageToShow, config.ip + '/user/submitEform', options)
          .then((data) => {
            this.getEform();
          }, (err) => {
          });
      }, (error) => console.log(error))



    }, (err) => {
      this.debugger = err;
      // Handle error
    });
  }

}
