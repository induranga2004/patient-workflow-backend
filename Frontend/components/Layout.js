import Navbar from "./Navbar";

export default function Layout({title='patient Portal',children}){
    return(
        <>
      <Navbar />
      <div className="container">
        <h2 style={{margin:'16px 0 10px'}}>{title}</h2>
        {children}
      </div>
    </>
    )
}