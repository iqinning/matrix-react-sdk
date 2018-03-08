/*
Copyright 2018 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

import MImageBody from './MImageBody';
import sdk from '../../../index';
import TintableSVG from '../elements/TintableSvg';

export default class MStickerBody extends MImageBody {
    displayName: 'MStickerBody'

    constructor(props) {
      super(props);

      this._onMouseEnter = this._onMouseEnter.bind(this);
      this._onMouseLeave = this._onMouseLeave.bind(this);
      this._onImageLoad = this._onImageLoad.bind(this);
    }

    _onMouseEnter() {
        this.setState({showTooltip: true});
    }

    _onMouseLeave() {
        this.setState({showTooltip: false});
    }

    _onImageLoad() {
        this.setState({
            placeholderClasses: 'mx_MStickerBody_placeholder_invisible',
        });
        setTimeout(() => {
            this.setState({
                placeholderVisible: false,
                thumbnailClasses: 'mx_MStickerBody_thumbnail_visible',
            });
        }, 500);
    }

    _afterComponentDidMount() {
        if (this.refs.image.complete) {
            // Image already loaded
            this.setState({
                placeholderVisible: false,
                placeholderClasses: '.mx_MStickerBody_placeholder_invisible',
                thumbnailClasses: 'mx_MStickerBody_thumbnail_visible',
            });
        } else {
            // Image not already loaded
            this.setState({
                placeholderVisible: true,
                placeholderClasses: '',
                thumbnailClasses: '',
            });
        }
    }

    _messageContent(contentUrl, thumbUrl, content) {
        let tooltip;
        const tooltipBody = (
            this.props.mxEvent &&
            this.props.mxEvent.getContent() &&
            this.props.mxEvent.getContent().body) ?
            this.props.mxEvent.getContent().body : null;
        if (this.state.showTooltip && tooltipBody) {
            const RoomTooltip = sdk.getComponent('rooms.RoomTooltip');
            tooltip = <RoomTooltip
                className='mx_RoleButton_tooltip'
                label={tooltipBody} />;
        }

        const gutterSize = 0;
        let placeholderSize = 75;
        let placeholderFixupHeight = '100px';
        let placeholderTop = 0;
        let placeholderLeft = 0;

        if (content.info) {
            placeholderTop = Math.floor((content.info.h/2) - (placeholderSize/2)) + 'px';
            placeholderLeft = Math.floor((content.info.w/2) - (placeholderSize/2) + gutterSize) + 'px';
            placeholderFixupHeight = content.info.h + 'px';
        }

        placeholderSize = placeholderSize + 'px';
        console.warn('placeholder classes', this.state.placeholderClasses);

        return (
            <span className='mx_MStickerBody' ref='body'
                style={{
                    height: placeholderFixupHeight,
                }}>
                <div className={'mx_MStickerBody_thumbnail_container'}>

                    <div
                        className={'mx_MStickerBody_placeholder ' + this.state.placeholderClasses}
                        style={{
                            top: placeholderTop,
                            left: placeholderLeft,
                        }}
                    >
                        <TintableSVG
                            src={'img/icons-show-stickers.svg'}
                            width={placeholderSize}
                            height={placeholderSize} />
                    </div>
                    <img
                        className={'mx_MStickerBody_thumbnail ' + this.state.thumbnailClasses}
                        src={thumbUrl}
                        ref='image'
                        alt={content.body}
                        onLoad={this.props.onWidgetLoad}
                        onLoad={this._onImageLoad}
                        onMouseEnter={this._onMouseEnter}
                        onMouseLeave={this._onMouseLeave}
                    />
                    { tooltip }
                </div>
            </span>
        );
    }

    onClick() {
    }
}