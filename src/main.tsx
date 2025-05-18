import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Routes} from "@/routes";


const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = createRoot(rootElement)
    root.render(
        <StrictMode>
            <Routes />
        </StrictMode>,
    )
}

