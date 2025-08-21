import React, { useEffect, useState } from 'react'
import SubscriptionPlans from '../components/SubscriptionPlans'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getUserDataDecrypted } from '../helpers/userStorage'

const SubscriptionPage = () => {
    const [subscribe, setSubscribe] = useState(null)

    const getUserData = async () => {
        try {
            const user = await getUserDataDecrypted()
            setSubscribe(user)
            console.log()
        } catch (error) {
            console.log("ERROR IN SUBSCRIBE PAGE", error)
        }
    }

    useEffect(()=>{
        getUserData()
    },[])
    return (
        <>
            <Header />
            <SubscriptionPlans userInfo={subscribe} />
            {/* <Footer /> */}
        </>
    )
}

export default SubscriptionPage