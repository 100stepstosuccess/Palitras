function getFields({ fields, isInclude }) {
  if (!fields) {
    return {};
  }

  const fieldsKeys = fields.split(",");

  const res = fieldsKeys.reduce((result, item) => {
    result[item] = +isInclude;
    return result;
  }, {});

  return res;
}

class PictureService {
  constructor(Picture, User) {
    this.Picture = Picture;
    this.User = User;
  }

  async findById(id) {
    return await this.Picture.findById(id).exec();
  }

  async getPictures({ sort, selection, page = 1, limit = 10, author }) {
    const match = author ? { author } : {};

    return await this.Picture.paginate(match, {
      page,
      limit,
      sort,
      select: getFields(selection),
      populate: { path: "author", select: "username email" }
    });
  }

  async getFavorites({ sort, selection, userId }) {
    const currentUser = await this.User.findById(userId).populate({
      path: "favorites",
      select: getFields(selection),
      options: { sort }
    });

    return currentUser.favorites || [];
  }

  async getPicture(id) {
    return await this.Picture.findById(id)
      .populate("author", "email username avatar amountOfPictures")
      .select("_id name author imagePaths createdAt favAmount favUsers");
  }

  async findUserById(userId) {
    return await this.User.findById(userId);
  }

  async addPicture(data) {
    const user = await this.findUserById(data.author);

    if (user) {
      const picture = await this.savePicture(data);
      const isPictureWasAdded = user.addPicture(picture._id);
      return isPictureWasAdded && picture;
    }

    return false;
  }

  async savePicture(data) {
    return await this.Picture.create(data);
  }

  async updatePicture(id, data) {
    return await this.Picture.findByIdAndUpdate(id, data);
  }

  async removePictureInDB(picture, user) {
    await user.removeMyPicture(picture.id);
    await picture.remove();

    return picture;
  }

  async addInFavorites(id, user) {
    const picture = await this.findById(id);

    let updated = await picture.addFavorite(user.id);

    updated = updated && (await user.addFavorite(id));

    return { picture, updated };
  }

  async removeFromFavorites(id, user) {
    const picture = await this.findById(id);

    let updated = await picture.removeFavorite(user.id);

    updated = updated && (await user.removeFavorite(id));

    return { picture, updated };
  }
}

module.exports = PictureService;
