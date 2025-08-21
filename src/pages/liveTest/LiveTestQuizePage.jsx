import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getLiveQuizSlice } from '../../redux/LiveQuizeSlice'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import LiveQuizCard from './LiveQuizCard'

const LiveTestQuizePage = () => {
    const dispatch = useDispatch()
    const [quizData, setQuizData] = useState({})
    const [quizTypeKeys, setQuizTypeKeys] = useState([])
    const [selectedType, setSelectedType] = useState('')
    const [categoryKeys, setCategoryKeys] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')

    const getLiveQuiz = async () => {
        try {
            const res = await dispatch(getLiveQuizSlice()).unwrap();
            console.log("response live quiz ===>", res);

            if (res?.status_code == 200) {
                const data = res.data?.not_attended_quizzes
                console.log(data)

                if (data && typeof data === 'object' && Object.keys(data).length > 0) {
                    const typeKeys = Object.keys(data)
                    const defaultType = typeKeys[0]
                    const catKeys = Object.keys(data[defaultType])
                    const defaultCat = catKeys[0]

                    setQuizTypeKeys(typeKeys)
                    setSelectedType(defaultType)
                    setCategoryKeys(catKeys)
                    setSelectedCategory(defaultCat)
                    setQuizData(data)

                    // console.log("🎯 Quiz Types:", typeKeys)
                    // console.log("📂 Categories for", defaultType, ":", catKeys)
                } else {
                    console.log("❌ No quizzes found")
                    setQuizTypeKeys([])
                    setCategoryKeys([])
                    setQuizData({})
                }
            }
        } catch (error) {
            console.error("❌ ERROR:", error)
        }
    }

    useEffect(() => {
        getLiveQuiz()
    }, [])

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Live Test Quizzes</h2>

            {/* Filter for Quiz Type */}
            {/* <div className="flex gap-3 mb-4">
                {quizTypeKeys.map((type) => (
                    <button
                        key={type}
                        onClick={() => {
                            setSelectedType(type)
                            const catKeys = Object.keys(quizData[type])
                            setCategoryKeys(catKeys)
                            setSelectedCategory(catKeys[0])
                        }}
                        className={`px-4 py-2 rounded ${selectedType === type ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {type}
                    </button>
                ))}
            </div> */}

            {/* Filter for Categories */}
            <div className="mb-4">
                <Swiper
                    spaceBetween={10}
                    slidesPerView="auto"
                    className="!overflow-visible"
                >
                    {categoryKeys.map((cat) => (
                        <SwiperSlide key={cat} style={{ width: "auto" }}>
                            <button
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded ${selectedCategory === cat
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Show Quizzes */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizData[selectedType] && quizData[selectedType][selectedCategory]?.length > 0 ? (
                    quizData[selectedType][selectedCategory].map((quiz, index) => {
                        return(
                        <LiveQuizCard key={quiz.id} data={quiz} index={index} />
                    )
                    })
                ) : (
                    <p>No quizzes available</p>
                )}
            </div>
        </div>
    )
}

export default LiveTestQuizePage
