import { useNavigate } from "react-router";

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className="w-full rounded-lg overflow-hidden shadow hover:scale-105 hover:shadow-primary/25 duration-300 cursor-pointer bg-white"
    >
      <img src={image} alt="" className="aspect-video w-full object-cover" />

      <div className="p-5 flex flex-col gap-3">
        <span className="px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs w-fit">
          {category}
        </span>

        <h5 className="font-medium text-gray-900 line-clamp-2">{title}</h5>

        <p
          className="text-xs text-gray-600 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: description.slice(0, 80) }}
        ></p>
      </div>
    </div>
  );
};

export default BlogCard;
