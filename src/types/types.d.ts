interface PostData {
  title: string;
  attachment: string;
  description: string;
  isGhost: boolean;
}

interface ColumnData {
  title: string;
  posts: PostData[];
  isGhost: boolean;
}