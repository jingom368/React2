import { useEffect, useRef, useState } from 'react'

function App() {
    return (
        <div className="exam">
            <h1>useState 예제</h1>
            <Exam1 /> <br />
            <br />
            <Exam2 />
            <h1>useEffect 예제</h1>
            <Exam3 /> <br /> <br />
            <Exam4 />
            <h1> useRef 예제</h1>
            <Exam5 />
        </div>
    )
}

// 5. Ref Object를 리턴하는 Hook 함수. 리턴한 Ref 값은 컴포넌트 전 생애 기간동안 값이 유지
// useMemo & useCallback
// useMemo : Memoization(반복된 계산을 매번 다시 수행하는 것이 아니라
//           캐싱해 놓은 결과를 불러서 재사용하는 기법
//           useMemo 함수의 2번째 인자의 의존성 배열의 값이 변경될 때만 첫번째 인자인
//           콜백 함수를 실행시키고, 실행이 안 되었을 경우는 기존 보관 중인 값을 리턴
// useCallback : 리턴되는 것이 값 (value)이 아니라 콜백함수 자체를 리턴 ...

// 리액트에서 state 값이 변경될 시에 렌더링이 발생
const Exam5 = () => {
    const [count, setCount] = useState(1)
    const countRef = useRef(1) // countRef가 {current:1} 객체를 참조
    const renderCount = useRef(1)

    let countVar = 0

    const increaseCountState = () => {
        setCount(count + 1)
    }

    const increaseCountVar = () => {
        countVar = countVar + 1
        console.log('Var = ' + countVar)
    }

    const increaseCountRef = () => {
        countRef.current = countRef.current + 1
        console.log('Ref = ' + countRef.current)
    }

    useEffect(() => {
        // 매번 렌더링시 실행 --> 리액트는 검사를 위해서 두번 렌더링함
        // Ref는 렌더링 시에 값의 변화를 주기 위해선 useEffect 내에 넣어 줘야 함
        renderCount.current = renderCount.current + 1
        console.log('Exam5 예제 ' + renderCount.current + '번째 렌더링')
    })

    return (
        <div>
            <p>State: {count}</p>
            <p>Var: {countVar}</p>
            <p>Ref: {countRef.current}</p>
            <button onClick={increaseCountState}>State 증가</button>
            <button onClick={increaseCountVar}>Var 증가</button>
            <button onClick={increaseCountRef}>Ref 증가</button>
        </div>
    )
}

// useEffect 예제

const Exam4 = () => {
    const [showTimer, setShowTimer] = useState(false)
    let btn_name
    if (showTimer) btn_name = '타이머 중지'
    else btn_name = '타이머 시작'

    return (
        <div>
            {showTimer && <Timer />}{' '}
            {/* showTimer가 true일 때 <Timer />를 실행*/}
            {/* <Timer />를 실행시킨 state 변수의 상태값이 변했을 시 */}
            {/* clearInterval() 함수를 콜백함수 형태로 실행 시키면 기존에 작동하던 콜백함수가 중단 */}
            <button onClick={() => setShowTimer(!showTimer)}>{btn_name}</button>
        </div>
    )
}

// 호텔은 쿠키를 정해서 3분 뒤에 빠져나가게끔 정해서 해야 함.
// 웹소켓으로 구현해서

const Timer = () => {
    useEffect(() => {
        const timer = setInterval(() => {
            console.log('타이머 돌아가는 중')
        }, 1000)
        return () => {
            clearInterval(timer)
            console.log('타이머가 종료되었습니다.')
        }
    }, [])
    return (
        <div>
            <span>타이머를 시작합니다. 콘솔을 보세요.</span>
        </div>
    )
}

const Exam3 = () => {
    const [count, setCount] = useState(1)
    const [name, setName] = useState('')

    const handleCountClick = () => {
        setCount((count) => count + 1)
    }

    const handleInputChange = (e) => {
        setName(e.target.value)
        console.log(name)
    }

    // 매번 렌더링이 될때마다 콜백함수가 실행
    useEffect(() => {
        console.log('렌더링 발생시 콜백 함수 실행...')
    })

    // 마운트 (첫 번째 렌더링이 일어날때만 콜백함수가 실행)
    useEffect(() => {
        console.log('마운트 시에만 콜백 함수 실행...')
    }, [])

    // 마운트(첫 번째 렌더링)와 count값이 변경될 때만 콜백함수가 실행)
    useEffect(() => {
        console.log('마운트와 count 값이 바뀔때만 콜백 함수 실행...')
    }, [count])

    return (
        <div>
            <button onClick={handleCountClick}>클릭</button>
            <span>count : {count}</span>
            <br />
            <input type="text" value={name} onChange={handleInputChange} />{' '}
            <br />
            <span>name : {name} </span>
        </div>
    )
}

// useState 예제

const Exam2 = () => {
    // const [names, setNames] = useState(['김철수', '김민수'])
    const [names, setNames] = useState(() => {
        return ['김철수', '김민수']
    })
    // 초기값을 콜백 형태로 넣어 주게 되면 처음 렌더링 될 때만
    // 한 번 불러 오게 되고
    // 다음 로딩 시에는 실행이 안 되기 때문에 시스템 비용을 절약할 수 있음.

    const [input, setInput] = useState('')

    const handleInputChange = (e) => {
        setInput(e.target.value)
        console.log(input)
    }

    const handleClick = () => {
        setNames((prevState) => {
            // 이렇게 스레드 연산자를 이용하면 기존 input배열(prevState)에 추가적으로
            // 값이 추가되는 효과를 낸다...
            return [input, ...prevState]
        }) // names 배열에 input에 새로 저장된 값과 이전값이 저장된다.
    }

    return (
        <div>
            <input type="text" onChange={handleInputChange} />
            <button onClick={handleClick}>클릭</button>
            {names.map((name, index) => {
                return <p key={index}>{name}</p>
            })}
        </div>
    )
}

const Exam1 = () => {
    const [time, setTime] = useState(1)

    const handleClick = () => {
        let newTime
        if (time >= 12) newTime = 1
        else newTime = time + 1
        setTime(newTime)
    }

    return (
        <div>
            <span>현재 시간 : {time}시</span>
            <button onClick={handleClick}>시간 변경</button>
        </div>
    )
}

export default App
