import { SidebarDashboar } from "./_components/sidebar"


export default function DashboardLayout({children}:{
    children:React.ReactNode
}){
    return(
        <>
            <SidebarDashboar>
                {children}
            </SidebarDashboar>
            
        </>
    )
}