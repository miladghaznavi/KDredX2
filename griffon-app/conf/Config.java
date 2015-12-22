import griffon.util.AbstractMapResourceBundle;

import javax.annotation.Nonnull;
import java.util.Map;

import static java.util.Arrays.asList;
import static griffon.util.CollectionUtils.map;

public class Config extends AbstractMapResourceBundle {
    private final static String TITLE = "Multi Tech Vis";

    @Override
    protected void initialize(@Nonnull Map<String, Object> entries) {
        map(entries)
            .e("application", map()
                .e("title", TITLE)
                .e("startupGroups", asList("multiTechVis"))
                .e("autoShutdown", true)
            )
            .e("mvcGroups", map()
                .e("multiTechVis", map()
                    .e("model", "org.mtv.MultiTechVisModel")
                    .e("view", "org.mtv.MultiTechVisView")
                    .e("controller", "org.mtv.MultiTechVisController")
                )
                .e("dataTab", map()
                    .e("model", "org.mtv.DataTabModel")
                    .e("view", "org.mtv.DataTabView")
                    .e("controller", "org.mtv.DataTabController")
                )
                .e("chartTab", map()
                    .e("model", "org.mtv.ChartTabModel")
                    .e("view", "org.mtv.ChartTabView")
                    .e("controller", "org.mtv.ChartTabController")
                )
                .e("commonToolBox", map()
                    .e("model", "org.mtv.controls.CommonToolBoxModel")
                    .e("view", "org.mtv.controls.CommonToolBoxView")
                    .e("controller", "org.mtv.controls.CommonToolBoxController")
                )
            );
    }
}