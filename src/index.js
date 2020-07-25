import {
    AjaxLoader
} from './ajax-loader'
import {
    BaseState,
    CreateStore,
    Tracer
} from './store'
import BaseModel from './model'
import isMobile from './utils/detect-mobile'
import ImagePlaceHolder from './utils/image-placeholder'

export {
    //ajax loading動態
    AjaxLoader,
    //狀態管理
    BaseState,
    CreateStore,
    Tracer,
    //基底Model
    BaseModel,
    //瀏覽器OS判斷
    isMobile,
    //圖片placeholder
    ImagePlaceHolder
}