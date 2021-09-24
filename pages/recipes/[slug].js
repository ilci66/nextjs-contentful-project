import { createClient } from 'contentful'
// this one is necessary to render rich text
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Image from 'next/image'
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
  const { featuredImage, title, cookingTime, ingredients, method } = recipe.fields
  // console.log(method)

  // console.log(recipe)
  
  return (
    <div>
      <div className="banner">
        {/* url properties don't have the https in front be careful with that */}
        <Image 
          src={'https:' + featuredImage.fields.file.url}
          // leaving these here like that instead of stretching the image to remind myself this is possible this way
          width={featuredImage.fields.file.details.image.width}
          height={featuredImage.fields.file.details.image.height}
        />
        <h2>{ title }</h2>
      </div>

      <div className="info">
        <p>Takes about { cookingTime } mins to cook.</p>
        <h3>Ingredients:</h3>
        {/* ingredients is an array */}
        {ingredients.map(ing => (
          <span key={ing}>{ ing }</span>
        ))}
      </div>
        
      <div className="method">
        <h3>Method:</h3>
        <div className="rich-text">{documentToReactComponents(method)}</div>
      </div>
      <p>Laborum dolore ex sint deserunt ad sunt ullamco pariatur amet cillum. Ut sint nisi incididunt Lorem et irure pariatur. Magna officia duis enim quis adipisicing deserunt cillum ut. Velit labore dolor excepteur sint ut anim aute Lorem. Non irure nisi sunt cupidatat voluptate dolor ea est do ad sint aute. Exercitation eiusmod eu tempor sit dolore.


Quis commodo eu laborum velit laboris cupidatat aliquip elit. Non laborum adipisicing excepteur laboris. Elit ut irure qui aliquip. Nostrud ut cupidatat veniam proident occaecat eiusmod sunt magna officia amet. Ad qui laboris dolor occaecat do ut ex. Laborum eiusmod sit sunt quis nulla minim.


Qui et voluptate magna nulla cupidatat eu aliquip id mollit qui incididunt excepteur cillum ex. Quis excepteur cillum pariatur elit dolore laboris adipisicing est nulla. Id nisi laborum deserunt officia amet aliquip tempor ad reprehenderit ea ullamco non.


Dolor eiusmod reprehenderit in exercitation anim. Eu non laborum ipsum aliqua sit fugiat aute. Sunt eu amet nisi laboris ea sit. Non sit culpa voluptate tempor quis nostrud.</p>
      <style jsx>{`
        h2,h3 {
          text-transform: uppercase;
        }
        .method {
          word-wrap: normal;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
    </div>
  )
}