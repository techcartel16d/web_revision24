import React, { useEffect, useState } from 'react'
import SubscriptionPlans from '../components/SubscriptionPlans'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getUserDataDecrypted } from '../helpers/userStorage'

const SubscriptionPage = () => {
    const [subscribe, setSubscribe] = useState(null)
    const [loading, setLoading] = useState(false)

    const getUserData = async () => {
        setLoading(true)
        try {
            const user = await getUserDataDecrypted()
            setSubscribe(user)
            console.log(user)
        } catch (error) {
            console.log("ERROR IN SUBSCRIBE PAGE", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <>
            <Header />

{
    subscribe && (

        <SubscriptionPlans userInfo={subscribe} />
    )
}


            {/* <Footer /> */}
        </>
    )
}

export default SubscriptionPage