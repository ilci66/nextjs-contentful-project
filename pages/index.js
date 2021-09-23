import { createClient } from 'contentful';

export async function getStaticProps() {

  // this is necessary for connecting 
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY
  })

  // this one's for getting the items from contentful, 
  // gotta specify the type of content you wanna get
  const res = await client.getEntries({ content_type: 'recipe' })


  return {
    props:{
      recipes: res.items
    }
  }

}



export default function Recipes({ recipes }) {
  console.log(recipes)
  return (
    <div className="recipe-list">
      Recipe List
    </div>
  )
}