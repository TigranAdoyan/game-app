import './index.scss';
import {ReactComponent as SpinnerIcon} from '../../assets/icons/spinner.svg';

function Loading(props) {
    return (
        <SpinnerIcon className="loading_container" fill="white" width={props.width} height={props.height}/>
    )
}

Loading.defaultProps = {
    width: 30,
    height: 30
};

export default Loading;
