import { createClient } from 'contentful'
// need to create a connection again
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
})

// next.js will create all these paths, as created 4 posts it ill create 
// a page for each post 
export const getStaticPaths = async () => {
  const res = await client.getEntries({ 
    content_type: "recipe" 
  })

  // with this, you are telling next.js what paths it needs to generate
  // well also all the static pages it needs to generate as well
  const paths = res.items.map(item => {
    return {
      params: { slug: item.fields.slug }
    }
  })

  return {
    paths,
    // if a page doesn't exist it will show a 404 page
    fallback: false
  }
}

// and then in the context object, destructured down below to get the params only,
// is given by getStaticPaths and contains the params which contains the slug,
// will be used to get a single item.
// have to use client multiple times because these 
// two functions have different purposes
export const getStaticProps = async ({ params }) => {
  // this was res.items, it will return an array even if there's one item inside
  const { items } = await client.getEntries({
    content_type: 'recipe',
    // this is one is for filtering
    'fields.slug': params.slug
  })

  return {
    props: { recipe: items[0] }
  }

}
// using the props.recipe here to render the page, finally
export default function RecipeDetails({ recipe }) {
  console.log(recipe)
  
  return (
    <div>
      Recipe Details
    </div>
  )
}