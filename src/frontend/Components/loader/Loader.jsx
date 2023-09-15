import './loader.scss';
import { useSelector } from 'react-redux';
import  {connect} from 'react-redux';
import { Spin } from 'antd';
const Loader = ({state}) => {

    const fadeDescition = state ? 'fade-in' : 'fade-out';
    return (
        <div className={`loader  ${fadeDescition}` }>
            <Spin size="large" />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        state: state.loader.status
    }
}

export default connect(mapStateToProps)(Loader);
