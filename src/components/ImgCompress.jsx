import React from "react";
import imageCompression from "browser-image-compression";
import {ProgressSteps, Step} from 'baseui/progress-steps';
import {Button, SHAPE, KIND, SIZE} from 'baseui/button';
import {Client as Styletron} from "styletron-engine-atomic";
import Card from "react-bootstrap/Card";

function SpacedButton(props) {
  return (
    <Button
      {...props}
      shape={SHAPE.pill}
      kind={KIND.secondary}
      size={SIZE.compact}
      overrides={{
        BaseButton: {
          style: ({$theme}) => ({
            marginLeft: $theme.sizing.scale200,
            marginRight: $theme.sizing.scale200,
            marginTop: $theme.sizing.scale800,
          }),
        },
      }}
    />
  );
}
export default class imgCompress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      compressedLink: "",
      defaultImgURI: "logo192.png",
      originalImage: "",
      originalLink: "",
      uploadImage: false,
      isCompressed: false,
      currentStep: 0,
      originalFileSize:0,
      compressedFileSize: 0,
      fileSizeDifference: 0
    };
    this.options = {
        minSizeMB: .1,
        maxWidthOrHeight: 500,
        useWebWorker: true
      };
    this.engine = new Styletron();
  }
  handle = e => {
    const imageFile = e.target.files[0];
    if (imageFile === undefined) {
        alert('Choose an image first!');
        return 0;    
    }    
    this.setState({
      originalLink: URL.createObjectURL(imageFile),
      originalImage: imageFile,
      outputFileName: imageFile.name,
      uploadImage: true,
      currentStep: 1,
      originalFileSize: imageFile.size
    });
  };
  getDownloadLink = o => {
    return URL.createObjectURL(o);
  };
  convertToMB = o => {
    return o / 1048576;
  };
  startCompress = e => {
    e.preventDefault();
    if (this.options.minSizeMB >= this.state.originalFileSize) {
      alert("Image is too small, can't be Compressed!");
      return 0;
    }
    if (!this.state.uploadImage) {
        alert('Choose an image first!');
        return 0;
    }
    imageCompression(this.state.originalImage, this.options).then(x => {
      let newSize = x.size;
      let diff = this.state.originalFileSize - newSize;
      this.setState({
        compressedLink: this.getDownloadLink(x),
        isCompressed: true,
        currentStep: 2,
        compressedFileSize: newSize,
        fileSizeDifference: diff
      });
    });
    return 1;
  };
  render() {
    const style = {
      imgCard: {
        width: "50%",
        minWidth: "50%",
        maxWidth: "50%",
      }
    }
    return (
      <div className="container">
          <ProgressSteps current={this.state.currentStep}>
            <Step title="Select a file">
              <div>
                Choose a file to upload
              </div>
              <input
                  type="file"
                  accept="image/*"
                  className="mt-2 btn btn-dark w-75"
                  onChange={e => this.handle(e)}
                  />
            </Step>
            <Step title="Compress">
              <div>
                Reduce the quality and size<br></br>
                <SpacedButton onClick={e => this.startCompress(e)}>
                  Compress
                </SpacedButton>
              </div>
              <SpacedButton onClick={() => this.setState({currentStep: 0}) }>
                Previous
              </SpacedButton>
            </Step>
            <Step title="Download">
              <div>
                <p>
                  Original size: { this.convertToMB(this.state.originalFileSize)} MB. <br></br>
                  Compressed size: { this.convertToMB(this.state.compressedFileSize) } MB. <br></br>
                  Difference: { this.convertToMB(this.state.fileSizeDifference) } MB. <br></br>
                  Difference (%): { (this.state.fileSizeDifference / this.state.originalFileSize) * 100 } %.
                </p>
                <SpacedButton>
                <a
                  href={this.state.compressedLink}
                  download={this.state.outputFileName}
                >
                  Download
                </a>
                </SpacedButton>
              </div>
              <SpacedButton onClick={() => this.setState({currentStep: 1}) }>
                Previous
              </SpacedButton>              
            </Step>
        </ProgressSteps>
        <div className="d-flex">
          <div className="flex-fill">
              {this.state.uploadImage ? (
                <Card.Img
                  className="ht"
                  variant="top"
                  src={this.state.originalLink}
                  style={style.imgCard}
                ></Card.Img>
              ) : (
                <Card.Img
                  className="ht"
                  variant="top"
                  src={this.state.defaultImgURI}
                  style={style.imgCard}
                ></Card.Img>
              )}
          </div>
          <div className="flex-fill">
              {this.state.isCompressed ? (
                <Card.Img
                  className="ht"
                  variant="top"
                  src={this.state.compressedLink}
                  style={style.imgCard}
                ></Card.Img>
              ) : (
                <Card.Img
                  className="ht"
                  variant="top"
                  src={this.state.defaultImgURI}
                  style={style.imgCard}
                ></Card.Img>
              )}
          </div>
        </div>
      </div>     
    );
  }
}