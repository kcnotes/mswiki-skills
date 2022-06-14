<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes"/>

    <!-- identity transform -->
    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="/">
        <skills>
            <xsl:apply-templates select="/imgdir/imgdir[@name='skill']/imgdir"/>
            <xsl:apply-templates select="/dir/dir[@name='skill']/dir"/>
        </skills>
    </xsl:template>
    <xsl:template match="/imgdir/imgdir[@name='skill']/imgdir">
        <skill>
            <id><xsl:value-of select="@name"/></id>
            <attr>
                <xsl:copy-of select="./imgdir[@name='common']/*"/>
            </attr>
            <info>
                <xsl:copy-of select="./imgdir[@name='info']/*"/>
                <xsl:if test="./string[@name='bgm']">
                    <xsl:copy-of select="./string[@name='bgm']"/>
                </xsl:if>
            </info>
            <xsl:copy-of select="./int" />
            <xsl:copy-of select="./int32" />
            <xsl:copy-of select="./int64" />
            <xsl:copy-of select="./string[@name='elemAttr']"/>
        </skill>
    </xsl:template>
    <xsl:template match="/dir/dir[@name='skill']/dir">
        <skill>
            <id><xsl:value-of select="@name"/></id>
            <attr>
                <xsl:copy-of select="./dir[@name='common']/*"/>
            </attr>
            <info>
                <xsl:copy-of select="./dir[@name='info']/*"/>
                <xsl:if test="./string[@name='bgm']">
                    <xsl:copy-of select="./string[@name='bgm']"/>
                </xsl:if>
            </info>
            <xsl:copy-of select="./int" />
            <xsl:copy-of select="./int32" />
            <xsl:copy-of select="./int64" />
            <xsl:copy-of select="./string[@name='elemAttr']"/>
        </skill>
    </xsl:template>
</xsl:stylesheet>