import {FidgetSpinner} from 'react-loader-spinner';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LoadingComponent() {
    return (
        <div className="page-container">
            <Navbar active={'Home'} />
            <div className="container loading-container">
                <FidgetSpinner
                    visible={true}
                    height="100"
                    width="100"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                    ballColors={['#ff0000', '#00ff00', '#0000ff']}
                    backgroundColor="#F4442E"
                />
            </div>
            <Footer />
        </div>
    )
}