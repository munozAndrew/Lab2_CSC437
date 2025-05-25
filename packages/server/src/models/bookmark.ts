export interface Bookmark {
  id: string           
  name: string         
  url: string          
  image?: string      

//meta
  description?: string 
  tags?: string[]     
  groupIds?: string[] 

  createdAt: Date   
  lastVisited?: Date  
  visitCount?: number

  orderIndex?: number  
  pinned?: boolean 
}
