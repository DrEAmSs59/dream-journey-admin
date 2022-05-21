import React, {lazy, Suspense} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Loading from "../components/Loading";
import App from "../App";

// 路由接口
interface IRoute {
    path: String;
    component: React.FC;
    children?: IRoute[]
}

// 定义路由接口数组，进行懒加载
const routerArray: IRoute[] = [
    // {path: "/", componment: App, children: [{path: "/storeInfo", componment: lazy(() => import("../componments/StoreInfo"))}]},
    {path: "/", component: App},
    {path: "/login", component: lazy(() => import("../pages/Login"))}
]

const GlobalRouter = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading/>}>
                <Routes>
                    {
                        routerArray.map((item: any, index: any) => {
                            return (
                                item.children ?
                                    <Route key={index} path={item.path} element={<item.component/>}>
                                        {
                                            item.children.map((e: any, i: any) => (
                                                <Route key={i} path={e.path} element={<e.component/>}/>
                                            ))
                                        }
                                    </Route>
                                    :
                                    <Route key={index} path={item.path} element={<item.component/>}/>
                            )
                        })
                    }
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default GlobalRouter;